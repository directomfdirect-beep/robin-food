const router = require('express').Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');

router.use(authenticate);

/** GET / — List addresses for user */
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT id, label, full_address, city, street, house, apartment,
              entrance, floor, intercom, latitude, longitude,
              is_default, created_at, updated_at
       FROM address
       WHERE user_id = $1
       ORDER BY is_default DESC, created_at ASC`,
      [req.user.id]
    );

    const addresses = rows.map(r => ({
      id: r.id,
      label: r.label,
      fullAddress: r.full_address,
      city: r.city,
      street: r.street,
      house: r.house,
      apartment: r.apartment,
      entrance: r.entrance,
      floor: r.floor,
      intercom: r.intercom,
      latitude: r.latitude,
      longitude: r.longitude,
      isDefault: r.is_default,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    res.json(addresses);
  } catch (err) {
    next(err);
  }
});

/** POST / — Create address (max 5 per user) */
router.post('/', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      label, fullAddress, city, street, house,
      apartment, entrance, floor, intercom,
      latitude, longitude,
    } = req.body;

    if (!fullAddress || !city || !street || !house) {
      return next(new AppError('fullAddress, city, street, and house are required', 'validation'));
    }

    const { rows: countRows } = await db.query(
      `SELECT COUNT(*)::int AS cnt FROM address WHERE user_id = $1`,
      [userId]
    );

    if (countRows[0].cnt >= 5) {
      return next(new AppError('Maximum 5 addresses allowed', 'validation'));
    }

    const isDefault = countRows[0].cnt === 0;

    const { rows } = await db.query(
      `INSERT INTO address (user_id, label, full_address, city, street, house,
                            apartment, entrance, floor, intercom,
                            latitude, longitude, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING id, label, full_address, city, street, house, apartment,
                 entrance, floor, intercom, latitude, longitude,
                 is_default, created_at, updated_at`,
      [
        userId, label || null, fullAddress, city, street, house,
        apartment || null, entrance || null, floor || null, intercom || null,
        latitude || null, longitude || null, isDefault,
      ]
    );

    const r = rows[0];
    res.status(201).json({
      id: r.id,
      label: r.label,
      fullAddress: r.full_address,
      city: r.city,
      street: r.street,
      house: r.house,
      apartment: r.apartment,
      entrance: r.entrance,
      floor: r.floor,
      intercom: r.intercom,
      latitude: r.latitude,
      longitude: r.longitude,
      isDefault: r.is_default,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    });
  } catch (err) {
    next(err);
  }
});

/** PUT /:id — Update address */
router.put('/:id', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const existing = await db.query(
      `SELECT id FROM address WHERE id = $1 AND user_id = $2`,
      [addressId, userId]
    );
    if (existing.rows.length === 0) {
      return next(new AppError('Address not found', 'not_found'));
    }

    const {
      label, fullAddress, city, street, house,
      apartment, entrance, floor, intercom,
      latitude, longitude, isDefault,
    } = req.body;

    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      if (isDefault === true) {
        await client.query(
          `UPDATE address SET is_default = false, updated_at = NOW()
           WHERE user_id = $1 AND is_default = true AND id != $2`,
          [userId, addressId]
        );
      }

      const { rows } = await client.query(
        `UPDATE address SET
           label = COALESCE($1, label),
           full_address = COALESCE($2, full_address),
           city = COALESCE($3, city),
           street = COALESCE($4, street),
           house = COALESCE($5, house),
           apartment = COALESCE($6, apartment),
           entrance = COALESCE($7, entrance),
           floor = COALESCE($8, floor),
           intercom = COALESCE($9, intercom),
           latitude = COALESCE($10, latitude),
           longitude = COALESCE($11, longitude),
           is_default = COALESCE($12, is_default),
           updated_at = NOW()
         WHERE id = $13 AND user_id = $14
         RETURNING id, label, full_address, city, street, house, apartment,
                   entrance, floor, intercom, latitude, longitude,
                   is_default, created_at, updated_at`,
        [
          label, fullAddress, city, street, house,
          apartment, entrance, floor, intercom,
          latitude, longitude, isDefault,
          addressId, userId,
        ]
      );

      await client.query('COMMIT');

      const r = rows[0];
      res.json({
        id: r.id,
        label: r.label,
        fullAddress: r.full_address,
        city: r.city,
        street: r.street,
        house: r.house,
        apartment: r.apartment,
        entrance: r.entrance,
        floor: r.floor,
        intercom: r.intercom,
        latitude: r.latitude,
        longitude: r.longitude,
        isDefault: r.is_default,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
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

/** DELETE /:id — Delete address, promote oldest if was default */
router.delete('/:id', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const { rows: deleted } = await db.query(
      `DELETE FROM address WHERE id = $1 AND user_id = $2 RETURNING is_default`,
      [addressId, userId]
    );

    if (deleted.length === 0) {
      return next(new AppError('Address not found', 'not_found'));
    }

    if (deleted[0].is_default) {
      await db.query(
        `UPDATE address SET is_default = true, updated_at = NOW()
         WHERE id = (
           SELECT id FROM address WHERE user_id = $1 ORDER BY created_at ASC LIMIT 1
         )`,
        [userId]
      );
    }

    res.json({ message: 'Address deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
