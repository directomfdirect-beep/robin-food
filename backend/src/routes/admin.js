const router = require('express').Router();
const db = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');

router.use(authenticate);
router.use(requireRole('admin'));

/** POST /users/invite — Create new user with role (picker/partner) */
router.post('/users/invite', async (req, res, next) => {
  try {
    const { phone, role, fullName } = req.body;

    if (!phone || typeof phone !== 'string') {
      return next(new AppError('phone is required', 'validation'));
    }
    if (!role || !['picker', 'partner'].includes(role)) {
      return next(new AppError('role must be "picker" or "partner"', 'validation'));
    }
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
      return next(new AppError('fullName is required', 'validation'));
    }

    const existing = await db.query(
      `SELECT id FROM app_user WHERE phone = $1`,
      [phone]
    );
    if (existing.rows.length > 0) {
      return next(new AppError('User with this phone already exists', 'conflict'));
    }

    const { rows } = await db.query(
      `INSERT INTO app_user (phone, role, full_name, status)
       VALUES ($1, $2, $3, 'active')
       RETURNING id, phone, role, full_name, status, created_at`,
      [phone, role, fullName.trim()]
    );

    const u = rows[0];
    res.status(201).json({
      id: u.id,
      phone: u.phone,
      role: u.role,
      fullName: u.full_name,
      status: u.status,
      createdAt: u.created_at,
    });
  } catch (err) {
    next(err);
  }
});

/** GET /users — List users with optional filters */
router.get('/users', async (req, res, next) => {
  try {
    const { role, status, cursor, limit: rawLimit } = req.query;
    const limit = Math.min(parseInt(rawLimit) || 50, 100);

    const conditions = [];
    const params = [];
    let paramIdx = 1;

    if (role) {
      conditions.push(`role = $${paramIdx++}`);
      params.push(role);
    }
    if (status) {
      conditions.push(`status = $${paramIdx++}`);
      params.push(status);
    }
    if (cursor) {
      conditions.push(`created_at < $${paramIdx++}`);
      params.push(cursor);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    params.push(limit + 1);
    const { rows } = await db.query(
      `SELECT id, phone, role, full_name, status, created_at, updated_at
       FROM app_user
       ${where}
       ORDER BY created_at DESC
       LIMIT $${paramIdx}`,
      params
    );

    const hasMore = rows.length > limit;
    const users = rows.slice(0, limit).map(u => ({
      id: u.id,
      phone: u.phone,
      role: u.role,
      fullName: u.full_name,
      status: u.status,
      createdAt: u.created_at,
      updatedAt: u.updated_at,
    }));

    const nextCursor = hasMore ? users[users.length - 1].createdAt : null;

    res.json({ users, nextCursor, hasMore });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
