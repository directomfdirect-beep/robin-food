const router = require('express').Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');

router.use(authenticate);

/** GET / — Get current user profile */
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT u.id, u.phone, u.full_name, u.role, u.avatar_url,
              u.deletion_scheduled_at, u.created_at, u.updated_at,
              dr.id AS deletion_request_id, dr.scheduled_at AS deletion_scheduled,
              dr.reason AS deletion_reason, dr.created_at AS deletion_requested_at
       FROM app_user u
       LEFT JOIN deletion_request dr
         ON dr.user_id = u.id AND dr.executed_at IS NULL
       WHERE u.id = $1`,
      [req.user.id]
    );

    if (rows.length === 0) {
      return next(new AppError('User not found', 'not_found'));
    }

    const user = rows[0];
    const profile = {
      id: user.id,
      phone: user.phone,
      fullName: user.full_name,
      role: user.role,
      avatarUrl: user.avatar_url,
      deletionScheduledAt: user.deletion_scheduled_at,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };

    if (user.deletion_request_id) {
      profile.deletionRequest = {
        id: user.deletion_request_id,
        scheduledAt: user.deletion_scheduled,
        reason: user.deletion_reason,
        requestedAt: user.deletion_requested_at,
      };
    }

    res.json(profile);
  } catch (err) {
    next(err);
  }
});

/** PUT / — Update profile (fullName only) */
router.put('/', async (req, res, next) => {
  try {
    const { fullName } = req.body;

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
      return next(new AppError('fullName must be a non-empty string', 'validation'));
    }

    const { rows } = await db.query(
      `UPDATE app_user
       SET full_name = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, phone, full_name, role, avatar_url, created_at, updated_at`,
      [fullName.trim(), req.user.id]
    );

    if (rows.length === 0) {
      return next(new AppError('User not found', 'not_found'));
    }

    const u = rows[0];
    res.json({
      id: u.id,
      phone: u.phone,
      fullName: u.full_name,
      role: u.role,
      avatarUrl: u.avatar_url,
      createdAt: u.created_at,
      updatedAt: u.updated_at,
    });
  } catch (err) {
    next(err);
  }
});

/** POST /delete — Request account deletion */
router.post('/delete', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { reason } = req.body;

    const activeStatuses = ['pending', 'confirmed', 'picking', 'ready', 'customer_arrived'];
    const { rows: activeOrders } = await db.query(
      `SELECT id FROM customer_order
       WHERE user_id = $1 AND status = ANY($2::text[])
       LIMIT 1`,
      [userId, activeStatuses]
    );

    if (activeOrders.length > 0) {
      return next(new AppError('Cannot delete account while you have active orders', 'conflict'));
    }

    const existing = await db.query(
      `SELECT id FROM deletion_request WHERE user_id = $1 AND executed_at IS NULL`,
      [userId]
    );
    if (existing.rows.length > 0) {
      return next(new AppError('Deletion already requested', 'conflict'));
    }

    const scheduledAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const { rows } = await client.query(
        `INSERT INTO deletion_request (user_id, reason, scheduled_at)
         VALUES ($1, $2, $3)
         RETURNING id, scheduled_at, created_at`,
        [userId, reason || null, scheduledAt]
      );

      await client.query(
        `UPDATE app_user SET deletion_scheduled_at = $1, updated_at = NOW() WHERE id = $2`,
        [scheduledAt, userId]
      );

      await client.query('COMMIT');

      res.status(201).json({
        message: 'Account deletion scheduled',
        deletionRequest: {
          id: rows[0].id,
          scheduledAt: rows[0].scheduled_at,
          createdAt: rows[0].created_at,
        },
      });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    next(err);
  }
});

/** POST /delete/cancel — Cancel account deletion */
router.post('/delete/cancel', async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { rowCount } = await db.query(
      `DELETE FROM deletion_request WHERE user_id = $1 AND executed_at IS NULL`,
      [userId]
    );

    if (rowCount === 0) {
      return next(new AppError('No pending deletion request found', 'not_found'));
    }

    await db.query(
      `UPDATE app_user SET deletion_scheduled_at = NULL, updated_at = NOW() WHERE id = $1`,
      [userId]
    );

    res.json({ message: 'Account deletion cancelled' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
