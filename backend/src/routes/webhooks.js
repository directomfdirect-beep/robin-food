const router = require('express').Router();
const db = require('../db');
const { verifyWebhookSignature, confirmPayment, cancelPayment } = require('../services/tinkoff');

/** POST /tinkoff — Tinkoff payment webhook */
router.post('/tinkoff', async (req, res) => {
  try {
    if (!verifyWebhookSignature(req.body)) {
      console.error('[WEBHOOK] Invalid Tinkoff signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const { PaymentId, Status, OrderId } = req.body;

    const { rows: txRows } = await db.query(
      `SELECT id, order_id, status AS current_status
       FROM payment_transaction
       WHERE provider_ref = $1`,
      [String(PaymentId)]
    );

    if (txRows.length === 0) {
      console.error(`[WEBHOOK] Transaction not found for PaymentId: ${PaymentId}`);
      return res.json({ status: 'OK' });
    }

    const tx = txRows[0];

    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      if (Status === 'AUTHORIZED') {
        await client.query(
          `UPDATE payment_transaction
           SET status = 'authorized', provider_status = $1, updated_at = NOW()
           WHERE id = $2`,
          [Status, tx.id]
        );

        await client.query(
          `UPDATE customer_order
           SET payment_status = 'authorized', updated_at = NOW()
           WHERE id = $1`,
          [tx.order_id]
        );
      } else if (Status === 'CONFIRMED') {
        await client.query(
          `UPDATE payment_transaction
           SET status = 'confirmed', provider_status = $1, updated_at = NOW()
           WHERE id = $2`,
          [Status, tx.id]
        );

        await client.query(
          `UPDATE customer_order
           SET payment_status = 'captured', updated_at = NOW()
           WHERE id = $1`,
          [tx.order_id]
        );
      } else if (Status === 'REJECTED' || Status === 'CANCELLED') {
        await client.query(
          `UPDATE payment_transaction
           SET status = 'failed', provider_status = $1, updated_at = NOW()
           WHERE id = $2`,
          [Status, tx.id]
        );

        await client.query(
          `UPDATE customer_order
           SET status = 'cancelled', payment_status = 'failed',
               cancelled_at = NOW(), cancel_reason = 'payment_failed', updated_at = NOW()
           WHERE id = $1 AND status NOT IN ('completed', 'cancelled')`,
          [tx.order_id]
        );
      } else {
        await client.query(
          `UPDATE payment_transaction
           SET provider_status = $1, updated_at = NOW()
           WHERE id = $2`,
          [Status, tx.id]
        );
      }

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

    res.json({ status: 'OK' });
  } catch (err) {
    console.error('[WEBHOOK] Tinkoff error:', err.message);
    res.status(500).json({ error: 'Internal error' });
  }
});

module.exports = router;
