const cron = require('node-cron');
const db = require('../db');

function startCronJobs() {
  /** Hold auto-cancel: every minute */
  cron.schedule('* * * * *', async () => {
    try {
      const { rows } = await db.query(
        `UPDATE customer_order
         SET status = 'cancelled', cancelled_at = NOW(), cancel_reason = 'hold_expired', updated_at = NOW()
         WHERE status = 'pending' AND hold_expires_at < NOW()
         RETURNING id`
      );

      if (rows.length > 0) {
        console.log(`[CRON] Auto-cancelled ${rows.length} expired hold orders: ${rows.map(r => r.id).join(', ')}`);

        for (const order of rows) {
          try {
            const { rows: txRows } = await db.query(
              `SELECT provider_ref FROM payment_transaction WHERE order_id = $1 AND status = 'authorized'`,
              [order.id]
            );
            if (txRows.length > 0) {
              await db.query(
                `UPDATE payment_transaction SET status = 'cancelled', updated_at = NOW() WHERE order_id = $1`,
                [order.id]
              );
            }
          } catch (payErr) {
            console.error(`[CRON] Failed to cancel payment for order ${order.id}:`, payErr.message);
          }
        }
      }
    } catch (err) {
      console.error('[CRON] Hold auto-cancel error:', err.message);
    }
  });

  /** Settlement pipeline: daily at 03:00 MSK (00:00 UTC) */
  cron.schedule('0 0 * * *', async () => {
    try {
      const today = new Date();
      const dayOfWeek = today.getUTCDay();

      if (dayOfWeek !== 1) return;

      const periodEnd = new Date(today);
      periodEnd.setUTCHours(0, 0, 0, 0);
      const periodStart = new Date(periodEnd);
      periodStart.setDate(periodStart.getDate() - 7);

      const { rows: existingPeriod } = await db.query(
        `SELECT id FROM settlement_period WHERE period_start = $1 AND period_end = $2`,
        [periodStart, periodEnd]
      );

      if (existingPeriod.length > 0) return;

      const { rows: campaigns } = await db.query(
        `SELECT DISTINCT c.id AS campaign_id, c.partner_id
         FROM customer_order o
         JOIN order_line ol ON ol.order_id = o.id
         JOIN offer off ON off.id = ol.offer_id
         JOIN campaign c ON c.id = off.campaign_id
         WHERE o.status = 'completed'
           AND o.completed_at >= $1
           AND o.completed_at < $2`,
        [periodStart, periodEnd]
      );

      for (const campaign of campaigns) {
        try {
          const { rows: periodRows } = await db.query(
            `INSERT INTO settlement_period (partner_id, campaign_id, period_start, period_end, status)
             VALUES ($1, $2, $3, $4, 'pending')
             RETURNING id`,
            [campaign.partner_id, campaign.campaign_id, periodStart, periodEnd]
          );

          const periodId = periodRows[0].id;

          await db.query(
            `INSERT INTO settlement_line (period_id, order_id, offer_id, quantity, unit_price, total_amount, status)
             SELECT $1, o.id, ol.offer_id, ol.quantity, ol.unit_price, ol.total_price, 'pending'
             FROM customer_order o
             JOIN order_line ol ON ol.order_id = o.id
             JOIN offer off ON off.id = ol.offer_id
             WHERE off.campaign_id = $2
               AND o.status = 'completed'
               AND o.completed_at >= $3
               AND o.completed_at < $4`,
            [periodId, campaign.campaign_id, periodStart, periodEnd]
          );

          const { rows: totals } = await db.query(
            `SELECT COUNT(*)::int AS total_lines, COALESCE(SUM(total_amount), 0) AS total_amount
             FROM settlement_line WHERE period_id = $1`,
            [periodId]
          );

          await db.query(
            `UPDATE settlement_period SET total_lines = $1, total_amount = $2 WHERE id = $3`,
            [totals[0].total_lines, totals[0].total_amount, periodId]
          );
        } catch (campErr) {
          console.error(`[CRON] Settlement error for campaign ${campaign.campaign_id}:`, campErr.message);
        }
      }

      console.log(`[CRON] Settlement pipeline created for period ${periodStart.toISOString()} - ${periodEnd.toISOString()}`);
    } catch (err) {
      console.error('[CRON] Settlement pipeline error:', err.message);
    }
  });

  /** Account deletion: daily at 04:00 MSK (01:00 UTC) */
  cron.schedule('0 1 * * *', async () => {
    try {
      const { rows: requests } = await db.query(
        `SELECT dr.id, dr.user_id
         FROM deletion_request dr
         WHERE dr.scheduled_at <= NOW() AND dr.executed_at IS NULL`
      );

      for (const request of requests) {
        const client = await db.getClient();
        try {
          await client.query('BEGIN');

          await client.query(
            `UPDATE app_user SET
               phone = 'deleted_' || id,
               full_name = 'Deleted User',
               avatar_url = NULL,
               status = 'deleted',
               updated_at = NOW()
             WHERE id = $1`,
            [request.user_id]
          );

          await client.query(
            `DELETE FROM refresh_token WHERE user_id = $1`,
            [request.user_id]
          );

          await client.query(
            `UPDATE deletion_request SET executed_at = NOW() WHERE id = $1`,
            [request.id]
          );

          await client.query('COMMIT');
          console.log(`[CRON] Account deleted for user ${request.user_id}`);
        } catch (delErr) {
          await client.query('ROLLBACK');
          console.error(`[CRON] Account deletion error for user ${request.user_id}:`, delErr.message);
        } finally {
          client.release();
        }
      }

      if (requests.length > 0) {
        console.log(`[CRON] Processed ${requests.length} account deletions`);
      }
    } catch (err) {
      console.error('[CRON] Account deletion error:', err.message);
    }
  });

  /** Smart alerts: every 30 minutes */
  cron.schedule('*/30 * * * *', async () => {
    try {
      const { rows: alerts } = await db.query(
        `SELECT sa.id, sa.user_id, sa.offer_id, sa.store_id,
                sa.trigger_type, sa.threshold_value
         FROM smart_alert sa
         WHERE sa.is_active = true AND sa.trigger_type = 'price_drop'`
      );

      for (const alert of alerts) {
        try {
          if (!alert.offer_id || !alert.threshold_value) continue;

          const { rows: offers } = await db.query(
            `SELECT discount_price, original_price FROM offer WHERE id = $1`,
            [alert.offer_id]
          );

          if (offers.length === 0) continue;

          const offer = offers[0];
          const dropPercent = ((offer.original_price - offer.discount_price) / offer.original_price) * 100;

          if (dropPercent >= parseFloat(alert.threshold_value)) {
            await db.query(
              `INSERT INTO smart_alert_log (alert_id, trigger_data, notification_sent)
               VALUES ($1, $2, true)`,
              [alert.id, JSON.stringify({ dropPercent, discountPrice: offer.discount_price, originalPrice: offer.original_price })]
            );

            await db.query(
              `UPDATE smart_alert SET last_triggered_at = NOW(), updated_at = NOW() WHERE id = $1`,
              [alert.id]
            );
          }
        } catch (alertErr) {
          console.error(`[CRON] Smart alert check error for alert ${alert.id}:`, alertErr.message);
        }
      }
    } catch (err) {
      console.error('[CRON] Smart alerts error:', err.message);
    }
  });

  /** OTP cleanup: every hour */
  cron.schedule('0 * * * *', async () => {
    try {
      const { rowCount: otpDeleted } = await db.query(
        `DELETE FROM otp_session WHERE expires_at < NOW()`
      );
      const { rowCount: tokenDeleted } = await db.query(
        `DELETE FROM refresh_token WHERE expires_at < NOW()`
      );

      if (otpDeleted > 0 || tokenDeleted > 0) {
        console.log(`[CRON] Cleanup: ${otpDeleted} expired OTPs, ${tokenDeleted} expired refresh tokens`);
      }
    } catch (err) {
      console.error('[CRON] OTP cleanup error:', err.message);
    }
  });

  console.log('[CRON] All cron jobs started');
}

module.exports = { startCronJobs };
