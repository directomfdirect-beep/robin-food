const express = require('express');
const router = express.Router();
const { query, getClient } = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');
const { confirmPayment } = require('../services/tinkoff');

/**
 * GET /orders
 * List orders for pickers. Picker role required.
 * Query: status filter (e.g., pending, picking, ready)
 */
router.get('/orders', authenticate, requireRole('picker'), async (req, res, next) => {
  try {
    const { status } = req.query;

    const validStatuses = ['pending', 'picking', 'ready', 'customer_arrived', 'completed'];
    let statusFilter = '';
    const params = [];
    let paramIdx = 1;

    if (status && validStatuses.includes(status)) {
      statusFilter = `WHERE co.status = $${paramIdx}`;
      params.push(status);
      paramIdx++;
    } else {
      statusFilter = `WHERE co.status IN ('pending', 'picking', 'ready', 'customer_arrived')`;
    }

    const { rows } = await query(
      `SELECT
         co.id,
         co.user_id,
         co.campaign_id,
         co.status,
         co.total_amount,
         co.picker_id,
         co.hold_expires_at,
         co.created_at,
         co.updated_at,
         c.name AS store_name,
         w.address AS store_address,
         u.name AS customer_name,
         u.phone AS customer_phone,
         (
           SELECT json_agg(json_build_object(
             'id', coi.id,
             'offerId', coi.offer_id,
             'productId', coi.product_id,
             'name', p.name,
             'brand', p.brand,
             'weight', p.weight,
             'weightUnit', p.weight_unit,
             'quantity', coi.quantity,
             'actualQuantity', coi.actual_quantity,
             'unitPrice', coi.unit_price,
             'totalPrice', coi.total_price
           ))
           FROM customer_order_item coi
           JOIN product p ON p.id = coi.product_id
           WHERE coi.order_id = co.id
         ) AS items
       FROM customer_order co
       LEFT JOIN campaign c ON c.id = co.campaign_id
       LEFT JOIN warehouse w ON w.id = c.warehouse_id
       LEFT JOIN app_user u ON u.id = co.user_id
       ${statusFilter}
       ORDER BY co.created_at ASC`,
      params
    );

    res.json({
      orders: rows.map(o => ({
        id: o.id,
        userId: o.user_id,
        campaignId: o.campaign_id,
        storeName: o.store_name,
        storeAddress: o.store_address,
        customerName: o.customer_name,
        customerPhone: o.customer_phone,
        status: o.status,
        totalAmount: parseFloat(o.total_amount),
        pickerId: o.picker_id,
        holdExpiresAt: o.hold_expires_at,
        createdAt: o.created_at,
        updatedAt: o.updated_at,
        items: o.items || [],
      })),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /orders/:id/accept
 * Picker accepts an order. Sets picker_id, status=picking.
 */
router.put('/orders/:id/accept', authenticate, requireRole('picker'), async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rows } = await query(
      `SELECT id, status, picker_id FROM customer_order WHERE id = $1`,
      [id]
    );

    if (rows.length === 0) {
      throw new AppError('Order not found', 'not_found');
    }

    const order = rows[0];

    if (order.status !== 'pending') {
      throw new AppError(
        `Cannot accept order with status "${order.status}". Only pending orders can be accepted`,
        'validation'
      );
    }

    if (order.picker_id) {
      throw new AppError('Order already assigned to another picker', 'conflict');
    }

    await query(
      `UPDATE customer_order
       SET picker_id = $1, status = 'picking', updated_at = NOW()
       WHERE id = $2 AND status = 'pending' AND picker_id IS NULL`,
      [req.user.id, id]
    );

    res.json({ success: true, message: 'Order accepted', status: 'picking' });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /orders/:id/item/:itemId/weigh
 * Set actual_quantity on an order item (weighted products).
 */
router.put(
  '/orders/:id/item/:itemId/weigh',
  authenticate,
  requireRole('picker'),
  async (req, res, next) => {
    try {
      const { id, itemId } = req.params;
      const { actualQuantity } = req.body;

      if (actualQuantity === undefined || actualQuantity === null || actualQuantity < 0) {
        throw new AppError('actualQuantity must be >= 0', 'validation');
      }

      const { rows: orderRows } = await query(
        `SELECT id, status, picker_id FROM customer_order WHERE id = $1`,
        [id]
      );

      if (orderRows.length === 0) {
        throw new AppError('Order not found', 'not_found');
      }

      if (orderRows[0].picker_id !== req.user.id) {
        throw new AppError('This order is not assigned to you', 'forbidden');
      }

      if (orderRows[0].status !== 'picking') {
        throw new AppError('Order must be in "picking" status to weigh items', 'validation');
      }

      const { rows } = await query(
        `UPDATE customer_order_item
         SET actual_quantity = $1
         WHERE id = $2 AND order_id = $3
         RETURNING id, offer_id, quantity, actual_quantity, unit_price`,
        [actualQuantity, itemId, id]
      );

      if (rows.length === 0) {
        throw new AppError('Order item not found', 'not_found');
      }

      const item = rows[0];

      res.json({
        success: true,
        item: {
          id: item.id,
          offerId: item.offer_id,
          requestedQuantity: item.quantity,
          actualQuantity: parseFloat(item.actual_quantity),
          unitPrice: parseFloat(item.unit_price),
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PUT /orders/:id/complete
 * Picker completes order. Validates all items have actual_quantity,
 * recalculates totals, captures payment, sets status=ready.
 */
router.put('/orders/:id/complete', authenticate, requireRole('picker'), async (req, res, next) => {
  const client = await getClient();

  try {
    await client.query('BEGIN');

    const { rows: orderRows } = await client.query(
      `SELECT id, status, picker_id, payment_id
       FROM customer_order
       WHERE id = $1
       FOR UPDATE`,
      [req.params.id]
    );

    if (orderRows.length === 0) {
      throw new AppError('Order not found', 'not_found');
    }

    const order = orderRows[0];

    if (order.picker_id !== req.user.id) {
      throw new AppError('This order is not assigned to you', 'forbidden');
    }

    if (order.status !== 'picking') {
      throw new AppError('Order must be in "picking" status to complete', 'validation');
    }

    const { rows: items } = await client.query(
      `SELECT id, quantity, actual_quantity, unit_price
       FROM customer_order_item
       WHERE order_id = $1`,
      [order.id]
    );

    const missingWeighing = items.filter(i => i.actual_quantity === null);
    if (missingWeighing.length > 0) {
      throw new AppError(
        `${missingWeighing.length} item(s) have not been weighed yet`,
        'validation'
      );
    }

    let newTotal = 0;
    for (const item of items) {
      const actualTotal = parseFloat(item.actual_quantity) * parseFloat(item.unit_price);
      newTotal += actualTotal;

      await client.query(
        `UPDATE customer_order_item
         SET total_price = $1
         WHERE id = $2`,
        [Math.round(actualTotal * 100) / 100, item.id]
      );
    }

    newTotal = Math.round(newTotal * 100) / 100;

    await client.query(
      `UPDATE customer_order
       SET total_amount = $1, status = 'ready', updated_at = NOW()
       WHERE id = $2`,
      [newTotal, order.id]
    );

    if (order.payment_id) {
      try {
        await confirmPayment(order.payment_id);
      } catch (payErr) {
        console.error('Payment capture failed:', payErr.message);
      }
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Order completed and ready for pickup',
      status: 'ready',
      totalAmount: newTotal,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

/**
 * POST /orders/:id/confirm-pickup
 * Confirm customer pickup. Validates status=customer_arrived, sets status=completed.
 */
router.post(
  '/orders/:id/confirm-pickup',
  authenticate,
  requireRole('picker'),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const { rows } = await query(
        `SELECT id, status, picker_id FROM customer_order WHERE id = $1`,
        [id]
      );

      if (rows.length === 0) {
        throw new AppError('Order not found', 'not_found');
      }

      const order = rows[0];

      if (order.picker_id !== req.user.id) {
        throw new AppError('This order is not assigned to you', 'forbidden');
      }

      if (order.status !== 'customer_arrived') {
        throw new AppError(
          `Cannot confirm pickup. Order status is "${order.status}", expected "customer_arrived"`,
          'validation'
        );
      }

      await query(
        `UPDATE customer_order
         SET status = 'completed', updated_at = NOW()
         WHERE id = $1`,
        [id]
      );

      res.json({
        success: true,
        message: 'Pickup confirmed, order completed',
        status: 'completed',
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
