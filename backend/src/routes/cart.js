const express = require('express');
const router = express.Router();
const { query, getClient } = require('../db');
const { authenticate } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');
const { initPayment } = require('../services/tinkoff');

/**
 * GET /
 * Get user's cart with items grouped by store.
 * Joins offer_prices for current prices. Adds warnings for price changes / unavailability.
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { rows: cartRows } = await query(
      `SELECT id AS cart_id FROM cart WHERE user_id = $1`,
      [req.user.id]
    );

    if (cartRows.length === 0) {
      return res.json({ cart: null, items: [], total: 0 });
    }

    const cartId = cartRows[0].cart_id;

    const { rows: items } = await query(
      `SELECT
         ci.id AS item_id,
         ci.offer_id,
         ci.store_id,
         ci.quantity,
         ci.price_at_add,
         o.is_active AS offer_active,
         p.name,
         p.brand,
         p.weight,
         p.weight_unit,
         op.price AS current_price,
         op.original_price,
         s.quantity AS stock_quantity,
         s.expires_at,
         c_camp.id AS campaign_id,
         c_camp.name AS store_name,
         w.address AS store_address,
         (SELECT pi.url FROM product_image pi WHERE pi.product_id = p.id ORDER BY pi.sort_order LIMIT 1) AS image_url
       FROM cart_item ci
       JOIN offer o ON o.id = ci.offer_id
       JOIN product p ON p.id = o.product_id
       LEFT JOIN offer_price op ON op.offer_id = o.id
       LEFT JOIN campaign c_camp ON c_camp.id = ci.store_id
       LEFT JOIN warehouse w ON w.id = c_camp.warehouse_id
       LEFT JOIN stock s ON s.offer_id = o.id AND s.warehouse_id = c_camp.warehouse_id
       WHERE ci.cart_id = $1
       ORDER BY c_camp.name, p.name`,
      [cartId]
    );

    const storeGroups = {};
    let total = 0;

    for (const item of items) {
      const warnings = [];
      const currentPrice = item.current_price ? parseFloat(item.current_price) : null;
      const priceAtAdd = item.price_at_add ? parseFloat(item.price_at_add) : null;

      if (!item.offer_active) {
        warnings.push('Item is no longer available');
      }
      if (item.stock_quantity !== null && item.stock_quantity <= 0) {
        warnings.push('Out of stock');
      }
      if (currentPrice && priceAtAdd && currentPrice !== priceAtAdd) {
        warnings.push(`Price changed from ${priceAtAdd} to ${currentPrice}`);
      }

      const effectivePrice = currentPrice || priceAtAdd || 0;
      const lineTotal = effectivePrice * item.quantity;
      total += lineTotal;

      const storeId = item.campaign_id || 'unknown';
      if (!storeGroups[storeId]) {
        storeGroups[storeId] = {
          storeId,
          storeName: item.store_name,
          storeAddress: item.store_address,
          items: [],
          subtotal: 0,
        };
      }

      storeGroups[storeId].items.push({
        itemId: item.item_id,
        offerId: item.offer_id,
        name: item.name,
        brand: item.brand,
        weight: item.weight,
        weightUnit: item.weight_unit,
        quantity: item.quantity,
        currentPrice: effectivePrice,
        originalPrice: item.original_price ? parseFloat(item.original_price) : null,
        lineTotal,
        stockQuantity: item.stock_quantity,
        expiresAt: item.expires_at,
        imageUrl: item.image_url,
        warnings,
      });

      storeGroups[storeId].subtotal += lineTotal;
    }

    res.json({
      cartId,
      stores: Object.values(storeGroups),
      total: Math.round(total * 100) / 100,
      itemCount: items.length,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /items
 * Add item to cart. Auto-create cart if needed.
 * Body: { offerId, storeId, quantity }
 */
router.post('/items', authenticate, async (req, res, next) => {
  try {
    const { offerId, storeId, quantity } = req.body;

    if (!offerId) throw new AppError('offerId is required', 'validation');
    if (!storeId) throw new AppError('storeId is required', 'validation');
    if (!quantity || quantity < 1) throw new AppError('quantity must be >= 1', 'validation');

    const { rows: offers } = await query(
      `SELECT o.id, op.price
       FROM offer o
       LEFT JOIN offer_price op ON op.offer_id = o.id
       WHERE o.id = $1 AND o.is_active = true`,
      [offerId]
    );

    if (offers.length === 0) {
      throw new AppError('Offer not found or inactive', 'not_found');
    }

    const currentPrice = offers[0].price ? parseFloat(offers[0].price) : 0;

    let { rows: carts } = await query(
      `SELECT id FROM cart WHERE user_id = $1`,
      [req.user.id]
    );

    if (carts.length === 0) {
      const { rows: newCarts } = await query(
        `INSERT INTO cart (user_id, created_at) VALUES ($1, NOW()) RETURNING id`,
        [req.user.id]
      );
      carts = newCarts;
    }

    const cartId = carts[0].id;

    const { rows: existing } = await query(
      `SELECT id, quantity FROM cart_item
       WHERE cart_id = $1 AND offer_id = $2 AND store_id = $3`,
      [cartId, offerId, storeId]
    );

    let item;
    if (existing.length > 0) {
      const { rows } = await query(
        `UPDATE cart_item
         SET quantity = quantity + $1, updated_at = NOW()
         WHERE id = $2
         RETURNING id, offer_id, store_id, quantity, price_at_add`,
        [quantity, existing[0].id]
      );
      item = rows[0];
    } else {
      const { rows } = await query(
        `INSERT INTO cart_item (cart_id, offer_id, store_id, quantity, price_at_add, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
         RETURNING id, offer_id, store_id, quantity, price_at_add`,
        [cartId, offerId, storeId, quantity, currentPrice]
      );
      item = rows[0];
    }

    res.status(201).json({
      success: true,
      item: {
        itemId: item.id,
        offerId: item.offer_id,
        storeId: item.store_id,
        quantity: item.quantity,
        priceAtAdd: parseFloat(item.price_at_add),
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /items/:id
 * Update item quantity.
 */
router.put('/items/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      throw new AppError('quantity must be >= 1', 'validation');
    }

    const { rows } = await query(
      `UPDATE cart_item ci
       SET quantity = $1, updated_at = NOW()
       FROM cart c
       WHERE ci.id = $2 AND ci.cart_id = c.id AND c.user_id = $3
       RETURNING ci.id, ci.offer_id, ci.store_id, ci.quantity`,
      [quantity, id, req.user.id]
    );

    if (rows.length === 0) {
      throw new AppError('Cart item not found', 'not_found');
    }

    res.json({ success: true, item: rows[0] });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /items/:id
 * Remove a single item from cart.
 */
router.delete('/items/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      `DELETE FROM cart_item ci
       USING cart c
       WHERE ci.id = $1 AND ci.cart_id = c.id AND c.user_id = $2`,
      [id, req.user.id]
    );

    if (result.rowCount === 0) {
      throw new AppError('Cart item not found', 'not_found');
    }

    res.json({ success: true, message: 'Item removed' });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /
 * Clear entire cart for the authenticated user.
 */
router.delete('/', authenticate, async (req, res, next) => {
  try {
    await query(
      `DELETE FROM cart_item ci
       USING cart c
       WHERE ci.cart_id = c.id AND c.user_id = $1`,
      [req.user.id]
    );

    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /checkout
 * Validate cart, group items by store, create orders, init payment, clear cart.
 * Returns { orders: [], paymentUrl }.
 */
router.post('/checkout', authenticate, async (req, res, next) => {
  const client = await getClient();

  try {
    await client.query('BEGIN');

    const { rows: cartRows } = await client.query(
      `SELECT id FROM cart WHERE user_id = $1`,
      [req.user.id]
    );

    if (cartRows.length === 0) {
      throw new AppError('Cart is empty', 'validation');
    }

    const cartId = cartRows[0].id;

    const { rows: items } = await client.query(
      `SELECT
         ci.id AS item_id,
         ci.offer_id,
         ci.store_id,
         ci.quantity,
         o.product_id,
         o.is_active AS offer_active,
         op.price AS current_price,
         s.quantity AS stock_quantity
       FROM cart_item ci
       JOIN offer o ON o.id = ci.offer_id
       LEFT JOIN offer_price op ON op.offer_id = o.id
       LEFT JOIN campaign camp ON camp.id = ci.store_id
       LEFT JOIN stock s ON s.offer_id = o.id AND s.warehouse_id = camp.warehouse_id
       WHERE ci.cart_id = $1
       FOR UPDATE`,
      [cartId]
    );

    if (items.length === 0) {
      throw new AppError('Cart is empty', 'validation');
    }

    for (const item of items) {
      if (!item.offer_active) {
        throw new AppError(`Item ${item.offer_id} is no longer available`, 'validation');
      }
      if (item.stock_quantity !== null && item.stock_quantity < item.quantity) {
        throw new AppError(
          `Insufficient stock for item ${item.offer_id}. Available: ${item.stock_quantity}`,
          'validation'
        );
      }
    }

    const storeGroups = {};
    for (const item of items) {
      if (!storeGroups[item.store_id]) {
        storeGroups[item.store_id] = [];
      }
      storeGroups[item.store_id].push(item);
    }

    const orders = [];
    let totalAmount = 0;
    const holdExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    for (const [storeId, storeItems] of Object.entries(storeGroups)) {
      let orderTotal = 0;
      for (const item of storeItems) {
        const price = item.current_price ? parseFloat(item.current_price) : 0;
        orderTotal += price * item.quantity;
      }

      const { rows: orderRows } = await client.query(
        `INSERT INTO customer_order (
           user_id, campaign_id, status, total_amount,
           hold_expires_at, created_at, updated_at
         )
         VALUES ($1, $2, 'pending', $3, $4, NOW(), NOW())
         RETURNING id`,
        [req.user.id, storeId, orderTotal, holdExpiresAt]
      );

      const orderId = orderRows[0].id;

      for (const item of storeItems) {
        const price = item.current_price ? parseFloat(item.current_price) : 0;
        await client.query(
          `INSERT INTO customer_order_item (
             order_id, offer_id, product_id, quantity,
             unit_price, total_price, created_at
           )
           VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
          [orderId, item.offer_id, item.product_id, item.quantity, price, price * item.quantity]
        );

        if (item.stock_quantity !== null) {
          await client.query(
            `UPDATE stock SET quantity = quantity - $1
             WHERE offer_id = $2 AND warehouse_id = (
               SELECT warehouse_id FROM campaign WHERE id = $3
             )`,
            [item.quantity, item.offer_id, storeId]
          );
        }
      }

      orders.push({
        id: orderId,
        storeId,
        total: Math.round(orderTotal * 100) / 100,
        status: 'pending',
        holdExpiresAt,
        itemCount: storeItems.length,
      });

      totalAmount += orderTotal;
    }

    const primaryOrderId = orders[0].id;
    const payment = await initPayment({
      orderId: primaryOrderId,
      amount: totalAmount,
      description: `Robin Food: ${orders.length} order(s)`,
      customerKey: String(req.user.id),
    });

    if (payment.paymentId) {
      for (const order of orders) {
        await client.query(
          `UPDATE customer_order SET payment_id = $1 WHERE id = $2`,
          [payment.paymentId, order.id]
        );
      }
    }

    await client.query(
      `DELETE FROM cart_item WHERE cart_id = $1`,
      [cartId]
    );

    await client.query('COMMIT');

    res.status(201).json({
      orders,
      paymentUrl: payment.paymentUrl,
      totalAmount: Math.round(totalAmount * 100) / 100,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

module.exports = router;
