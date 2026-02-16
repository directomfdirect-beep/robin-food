const router = require('express').Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');

router.use(authenticate);

/** GET / — List smart alerts for user */
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT id, offer_id, store_id, trigger_type, threshold_value,
              schedule, is_active, last_triggered_at, created_at, updated_at
       FROM smart_alert
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    const alerts = rows.map(r => ({
      id: r.id,
      offerId: r.offer_id,
      storeId: r.store_id,
      triggerType: r.trigger_type,
      thresholdValue: r.threshold_value,
      schedule: r.schedule,
      isActive: r.is_active,
      lastTriggeredAt: r.last_triggered_at,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    res.json(alerts);
  } catch (err) {
    next(err);
  }
});

/** POST / — Create smart alert (max 20 per user) */
router.post('/', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { offerId, storeId, triggerType, thresholdValue, schedule } = req.body;

    if (!triggerType) {
      return next(new AppError('triggerType is required', 'validation'));
    }

    const { rows: countRows } = await db.query(
      `SELECT COUNT(*)::int AS cnt FROM smart_alert WHERE user_id = $1`,
      [userId]
    );

    if (countRows[0].cnt >= 20) {
      return next(new AppError('Maximum 20 smart alerts allowed', 'validation'));
    }

    const { rows } = await db.query(
      `INSERT INTO smart_alert (user_id, offer_id, store_id, trigger_type, threshold_value, schedule)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, offer_id, store_id, trigger_type, threshold_value,
                 schedule, is_active, last_triggered_at, created_at, updated_at`,
      [userId, offerId || null, storeId || null, triggerType, thresholdValue || null, schedule || null]
    );

    const r = rows[0];
    res.status(201).json({
      id: r.id,
      offerId: r.offer_id,
      storeId: r.store_id,
      triggerType: r.trigger_type,
      thresholdValue: r.threshold_value,
      schedule: r.schedule,
      isActive: r.is_active,
      lastTriggeredAt: r.last_triggered_at,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    });
  } catch (err) {
    next(err);
  }
});

/** PUT /:id — Update alert (pause/resume, change threshold) */
router.put('/:id', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const alertId = req.params.id;

    const existing = await db.query(
      `SELECT id FROM smart_alert WHERE id = $1 AND user_id = $2`,
      [alertId, userId]
    );
    if (existing.rows.length === 0) {
      return next(new AppError('Alert not found', 'not_found'));
    }

    const { isActive, thresholdValue, triggerType, schedule } = req.body;

    const { rows } = await db.query(
      `UPDATE smart_alert SET
         is_active = COALESCE($1, is_active),
         threshold_value = COALESCE($2, threshold_value),
         trigger_type = COALESCE($3, trigger_type),
         schedule = COALESCE($4, schedule),
         updated_at = NOW()
       WHERE id = $5 AND user_id = $6
       RETURNING id, offer_id, store_id, trigger_type, threshold_value,
                 schedule, is_active, last_triggered_at, created_at, updated_at`,
      [isActive, thresholdValue, triggerType, schedule, alertId, userId]
    );

    const r = rows[0];
    res.json({
      id: r.id,
      offerId: r.offer_id,
      storeId: r.store_id,
      triggerType: r.trigger_type,
      thresholdValue: r.threshold_value,
      schedule: r.schedule,
      isActive: r.is_active,
      lastTriggeredAt: r.last_triggered_at,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    });
  } catch (err) {
    next(err);
  }
});

/** DELETE /:id — Delete alert */
router.delete('/:id', async (req, res, next) => {
  try {
    const { rowCount } = await db.query(
      `DELETE FROM smart_alert WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (rowCount === 0) {
      return next(new AppError('Alert not found', 'not_found'));
    }

    res.json({ message: 'Alert deleted' });
  } catch (err) {
    next(err);
  }
});

/** GET /:id/history — Get alert firing history */
router.get('/:id/history', async (req, res, next) => {
  try {
    const alertId = req.params.id;
    const userId = req.user.id;

    const existing = await db.query(
      `SELECT id FROM smart_alert WHERE id = $1 AND user_id = $2`,
      [alertId, userId]
    );
    if (existing.rows.length === 0) {
      return next(new AppError('Alert not found', 'not_found'));
    }

    const { rows } = await db.query(
      `SELECT id, triggered_at, trigger_data, notification_sent
       FROM smart_alert_log
       WHERE alert_id = $1
       ORDER BY triggered_at DESC
       LIMIT 100`,
      [alertId]
    );

    const history = rows.map(r => ({
      id: r.id,
      triggeredAt: r.triggered_at,
      triggerData: r.trigger_data,
      notificationSent: r.notification_sent,
    }));

    res.json(history);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
