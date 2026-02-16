const express = require('express');
const router = express.Router();
const { query } = require('../db');
const { authenticate } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');
const { cancelPayment } = require('../services/tinkoff');

const ACTIVE_STATUSES = ['pending', 'picking', 'ready', 'customer_arrived'];
const COMPLETED_STATUSES = ['completed'];
const CANCELLED_STATUSES = ['cancelled'];
const CHAT_ACTIVE_STATUSES = ['pending', 'picking', 'ready', 'customer_arrived'];

/**
 * GET /
 * List user's orders with pagination.
 * Query: status (active/completed/cancelled/all), cursor, limit (default 20)
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { status, cursor } = req.query;
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 50);

    let statusFilter = '';
    const params = [req.user.id, limit + 1];
    let paramIdx = 3;

    if (status === 'active') {
      statusFilter = `AND co.status = ANY($${paramIdx})`;
      params.push(ACTIVE_STATUSES);
      paramIdx++;
    } else if (status === 'completed') {
      statusFilter = `AND co.status = ANY($${paramIdx})`;
      params.push(COMPLETED_STATUSES);
      paramIdx++;
    } else if (status === 'cancelled') {
      statusFilter = `AND co.status = ANY($${paramIdx})`;
      params.push(CANCELLED_STATUSES);
      paramIdx++;
    }

    let cursorFilter = '';
    if (cursor) {
      cursorFilter = `AND co.id < $${paramIdx}`;
      params.push(cursor);
      paramIdx++;
    }

    const { rows } = await query(
      `SELECT
         co.id,
         co.campaign_id,
         co.status,
         co.total_amount,
         co.payment_id,
         co.hold_expires_at,
         co.created_at,
         co.updated_at,
         c.name AS store_name,
         w.address AS store_address,
         (
           SELECT json_agg(json_build_object(
             'id', coi.id,
             'offerId', coi.offer_id,
             'productId', coi.product_id,
             'name', p.name,
             'brand', p.brand,
             'quantity', coi.quantity,
             'actualQuantity', coi.actual_quantity,
             'unitPrice', coi.unit_price,
             'totalPrice', coi.total_price,
             'imageUrl', (SELECT pi.url FROM product_image pi WHERE pi.product_id = p.id ORDER BY pi.sort_order LIMIT 1)
           ))
           FROM customer_order_item coi
           JOIN product p ON p.id = coi.product_id
           WHERE coi.order_id = co.id
         ) AS items
       FROM customer_order co
       LEFT JOIN campaign c ON c.id = co.campaign_id
       LEFT JOIN warehouse w ON w.id = c.warehouse_id
       WHERE co.user_id = $1
         ${statusFilter}
         ${cursorFilter}
       ORDER BY co.created_at DESC
       LIMIT $2`,
      params
    );

    const hasMore = rows.length > limit;
    const orders = rows.slice(0, limit);
    const nextCursor = hasMore ? orders[orders.length - 1].id : null;

    res.json({
      orders: orders.map(o => ({
        id: o.id,
        campaignId: o.campaign_id,
        storeName: o.store_name,
        storeAddress: o.store_address,
        status: o.status,
        totalAmount: parseFloat(o.total_amount),
        holdExpiresAt: o.hold_expires_at,
        createdAt: o.created_at,
        updatedAt: o.updated_at,
        items: o.items || [],
      })),
      nextCursor,
      hasMore,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /:id
 * Order detail with items and rating.
 */
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rows } = await query(
      `SELECT
         co.id,
         co.campaign_id,
         co.status,
         co.total_amount,
         co.payment_id,
         co.picker_id,
         co.hold_expires_at,
         co.created_at,
         co.updated_at,
         c.name AS store_name,
         w.address AS store_address,
         w.lat AS store_lat,
         w.lng AS store_lng
       FROM customer_order co
       LEFT JOIN campaign c ON c.id = co.campaign_id
       LEFT JOIN warehouse w ON w.id = c.warehouse_id
       WHERE co.id = $1 AND co.user_id = $2`,
      [id, req.user.id]
    );

    if (rows.length === 0) {
      throw new AppError('Order not found', 'not_found');
    }

    const order = rows[0];

    const { rows: items } = await query(
      `SELECT
         coi.id,
         coi.offer_id,
         coi.product_id,
         coi.quantity,
         coi.actual_quantity,
         coi.unit_price,
         coi.total_price,
         p.name,
         p.brand,
         p.weight,
         p.weight_unit,
         (SELECT pi.url FROM product_image pi WHERE pi.product_id = p.id ORDER BY pi.sort_order LIMIT 1) AS image_url
       FROM customer_order_item coi
       JOIN product p ON p.id = coi.product_id
       WHERE coi.order_id = $1
       ORDER BY p.name`,
      [id]
    );

    const { rows: ratingRows } = await query(
      `SELECT id, rating, comment, created_at
       FROM order_rating
       WHERE order_id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    res.json({
      id: order.id,
      campaignId: order.campaign_id,
      storeName: order.store_name,
      storeAddress: order.store_address,
      storeLat: order.store_lat,
      storeLng: order.store_lng,
      status: order.status,
      totalAmount: parseFloat(order.total_amount),
      pickerId: order.picker_id,
      holdExpiresAt: order.hold_expires_at,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      items: items.map(i => ({
        id: i.id,
        offerId: i.offer_id,
        productId: i.product_id,
        name: i.name,
        brand: i.brand,
        weight: i.weight,
        weightUnit: i.weight_unit,
        quantity: i.quantity,
        actualQuantity: i.actual_quantity,
        unitPrice: parseFloat(i.unit_price),
        totalPrice: parseFloat(i.total_price),
        imageUrl: i.image_url,
      })),
      rating: ratingRows.length > 0 ? {
        id: ratingRows[0].id,
        rating: ratingRows[0].rating,
        comment: ratingRows[0].comment,
        createdAt: ratingRows[0].created_at,
      } : null,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /:id/cancel
 * Cancel an order. Only if status=pending. Cancels payment hold.
 */
router.post('/:id/cancel', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rows } = await query(
      `SELECT id, status, payment_id, total_amount
       FROM customer_order
       WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (rows.length === 0) {
      throw new AppError('Order not found', 'not_found');
    }

    const order = rows[0];

    if (order.status !== 'pending') {
      throw new AppError(
        `Cannot cancel order with status "${order.status}". Only pending orders can be cancelled`,
        'validation'
      );
    }

    if (order.payment_id) {
      try {
        await cancelPayment(order.payment_id, parseFloat(order.total_amount));
      } catch (payErr) {
        console.error('Payment cancellation failed:', payErr.message);
      }
    }

    await query(
      `UPDATE customer_order
       SET status = 'cancelled', updated_at = NOW()
       WHERE id = $1`,
      [id]
    );

    res.json({ success: true, message: 'Order cancelled' });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /:id/rate
 * Upsert order rating (1-5, optional comment). Only for completed orders.
 */
router.post('/:id/rate', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new AppError('Rating must be an integer between 1 and 5', 'validation');
    }

    if (comment && comment.length > 1000) {
      throw new AppError('Comment must be 1000 characters or less', 'validation');
    }

    const { rows: orderRows } = await query(
      `SELECT id, status FROM customer_order
       WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (orderRows.length === 0) {
      throw new AppError('Order not found', 'not_found');
    }

    if (orderRows[0].status !== 'completed') {
      throw new AppError('Can only rate completed orders', 'validation');
    }

    const { rows } = await query(
      `INSERT INTO order_rating (order_id, user_id, rating, comment, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       ON CONFLICT (order_id, user_id)
       DO UPDATE SET rating = $3, comment = $4, updated_at = NOW()
       RETURNING id, rating, comment, created_at`,
      [id, req.user.id, rating, comment || null]
    );

    res.json({ success: true, rating: rows[0] });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /:id/arrived
 * Customer arrived at store. Only if status=ready.
 */
router.post('/:id/arrived', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rows } = await query(
      `SELECT id, status FROM customer_order
       WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (rows.length === 0) {
      throw new AppError('Order not found', 'not_found');
    }

    if (rows[0].status !== 'ready') {
      throw new AppError(
        `Cannot mark as arrived. Order status is "${rows[0].status}", expected "ready"`,
        'validation'
      );
    }

    await query(
      `UPDATE customer_order
       SET status = 'customer_arrived', updated_at = NOW()
       WHERE id = $1`,
      [id]
    );

    res.json({ success: true, message: 'Marked as arrived', status: 'customer_arrived' });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /:id/chat
 * Get chat messages for an order.
 */
router.get('/:id/chat', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rows: orderRows } = await query(
      `SELECT id FROM customer_order
       WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (orderRows.length === 0) {
      throw new AppError('Order not found', 'not_found');
    }

    const { rows: messages } = await query(
      `SELECT
         cm.id,
         cm.sender_id,
         cm.sender_role,
         cm.message,
         cm.is_read,
         cm.created_at,
         u.name AS sender_name
       FROM chat_message cm
       LEFT JOIN app_user u ON u.id = cm.sender_id
       WHERE cm.order_id = $1
       ORDER BY cm.created_at ASC`,
      [id]
    );

    res.json({
      messages: messages.map(m => ({
        id: m.id,
        senderId: m.sender_id,
        senderRole: m.sender_role,
        senderName: m.sender_name,
        message: m.message,
        isRead: m.is_read,
        createdAt: m.created_at,
      })),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /:id/chat
 * Send a chat message. Max 1000 chars. Only in active order statuses.
 */
router.post('/:id/chat', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      throw new AppError('Message is required', 'validation');
    }

    if (message.length > 1000) {
      throw new AppError('Message must be 1000 characters or less', 'validation');
    }

    const { rows: orderRows } = await query(
      `SELECT id, status FROM customer_order
       WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (orderRows.length === 0) {
      throw new AppError('Order not found', 'not_found');
    }

    if (!CHAT_ACTIVE_STATUSES.includes(orderRows[0].status)) {
      throw new AppError('Chat is only available for active orders', 'validation');
    }

    const { rows } = await query(
      `INSERT INTO chat_message (order_id, sender_id, sender_role, message, is_read, created_at)
       VALUES ($1, $2, 'customer', $3, false, NOW())
       RETURNING id, sender_id, sender_role, message, is_read, created_at`,
      [id, req.user.id, message.trim()]
    );

    res.status(201).json({
      success: true,
      message: {
        id: rows[0].id,
        senderId: rows[0].sender_id,
        senderRole: rows[0].sender_role,
        message: rows[0].message,
        isRead: rows[0].is_read,
        createdAt: rows[0].created_at,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /:id/chat/read
 * Mark all unread messages as read for this order (messages from other party).
 */
router.post('/:id/chat/read', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rows: orderRows } = await query(
      `SELECT id FROM customer_order
       WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (orderRows.length === 0) {
      throw new AppError('Order not found', 'not_found');
    }

    const result = await query(
      `UPDATE chat_message
       SET is_read = true
       WHERE order_id = $1 AND sender_id != $2 AND is_read = false`,
      [id, req.user.id]
    );

    res.json({ success: true, markedCount: result.rowCount });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
