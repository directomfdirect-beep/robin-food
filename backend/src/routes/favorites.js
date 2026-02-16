const router = require('express').Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');

router.use(authenticate);

/** GET / — List favorites, optionally filtered by type */
router.get('/', async (req, res, next) => {
  try {
    const { type } = req.query;
    const userId = req.user.id;

    let query;
    let params;

    if (type === 'product') {
      query = `
        SELECT f.id, f.entity_type, f.entity_id, f.created_at,
               o.title AS offer_title, o.original_price, o.discount_price,
               o.image_url AS offer_image, o.expires_at AS offer_expires
        FROM favorite f
        LEFT JOIN offer o ON f.entity_type = 'product' AND f.entity_id = o.id
        WHERE f.user_id = $1 AND f.entity_type = 'product'
        ORDER BY f.created_at DESC`;
      params = [userId];
    } else if (type === 'store') {
      query = `
        SELECT f.id, f.entity_type, f.entity_id, f.created_at,
               c.store_name, c.store_address, c.logo_url AS store_logo
        FROM favorite f
        LEFT JOIN campaign c ON f.entity_type = 'store' AND f.entity_id = c.id
        WHERE f.user_id = $1 AND f.entity_type = 'store'
        ORDER BY f.created_at DESC`;
      params = [userId];
    } else {
      query = `
        SELECT f.id, f.entity_type, f.entity_id, f.created_at,
               o.title AS offer_title, o.original_price, o.discount_price,
               o.image_url AS offer_image, o.expires_at AS offer_expires,
               c.store_name, c.store_address, c.logo_url AS store_logo
        FROM favorite f
        LEFT JOIN offer o ON f.entity_type = 'product' AND f.entity_id = o.id
        LEFT JOIN campaign c ON f.entity_type = 'store' AND f.entity_id = c.id
        WHERE f.user_id = $1
        ORDER BY f.created_at DESC`;
      params = [userId];
    }

    const { rows } = await db.query(query, params);

    const favorites = rows.map(row => {
      const fav = {
        id: row.id,
        entityType: row.entity_type,
        entityId: row.entity_id,
        createdAt: row.created_at,
      };
      if (row.entity_type === 'product' && row.offer_title) {
        fav.details = {
          title: row.offer_title,
          originalPrice: row.original_price,
          discountPrice: row.discount_price,
          imageUrl: row.offer_image,
          expiresAt: row.offer_expires,
        };
      }
      if (row.entity_type === 'store' && row.store_name) {
        fav.details = {
          storeName: row.store_name,
          storeAddress: row.store_address,
          logoUrl: row.store_logo,
        };
      }
      return fav;
    });

    res.json(favorites);
  } catch (err) {
    next(err);
  }
});

/** POST / — Add favorite (idempotent) */
router.post('/', async (req, res, next) => {
  try {
    const { entityType, entityId } = req.body;

    if (!entityType || !['product', 'store'].includes(entityType)) {
      return next(new AppError('entityType must be "product" or "store"', 'validation'));
    }
    if (!entityId) {
      return next(new AppError('entityId is required', 'validation'));
    }

    const { rows } = await db.query(
      `INSERT INTO favorite (user_id, entity_type, entity_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, entity_type, entity_id) DO NOTHING
       RETURNING id, entity_type, entity_id, created_at`,
      [req.user.id, entityType, entityId]
    );

    if (rows.length === 0) {
      const existing = await db.query(
        `SELECT id, entity_type, entity_id, created_at
         FROM favorite
         WHERE user_id = $1 AND entity_type = $2 AND entity_id = $3`,
        [req.user.id, entityType, entityId]
      );
      return res.json({
        id: existing.rows[0].id,
        entityType: existing.rows[0].entity_type,
        entityId: existing.rows[0].entity_id,
        createdAt: existing.rows[0].created_at,
      });
    }

    res.status(201).json({
      id: rows[0].id,
      entityType: rows[0].entity_type,
      entityId: rows[0].entity_id,
      createdAt: rows[0].created_at,
    });
  } catch (err) {
    next(err);
  }
});

/** DELETE /:id — Remove favorite by id */
router.delete('/:id', async (req, res, next) => {
  try {
    const { rowCount } = await db.query(
      `DELETE FROM favorite WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (rowCount === 0) {
      return next(new AppError('Favorite not found', 'not_found'));
    }

    res.json({ message: 'Favorite removed' });
  } catch (err) {
    next(err);
  }
});

/** DELETE / — Batch delete favorites */
router.delete('/', async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return next(new AppError('ids must be a non-empty array', 'validation'));
    }

    const { rowCount } = await db.query(
      `DELETE FROM favorite WHERE id = ANY($1::uuid[]) AND user_id = $2`,
      [ids, req.user.id]
    );

    res.json({ deleted: rowCount });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
