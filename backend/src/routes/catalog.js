const express = require('express');
const router = express.Router();
const { query } = require('../db');
const { AppError } = require('../middleware/errorHandler');

/**
 * GET /
 * List stores near a location. Uses earthdistance for geo filtering.
 * Query: lat, lng, radius (km, default 3, max 10)
 */
router.get('/', async (req, res, next) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    let radius = parseFloat(req.query.radius) || 3;

    if (isNaN(lat) || isNaN(lng)) {
      throw new AppError('lat and lng query parameters are required', 'validation');
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw new AppError('Invalid coordinates', 'validation');
    }

    radius = Math.min(Math.max(radius, 0.1), 10);
    const radiusMeters = radius * 1000;

    const { rows } = await query(
      `SELECT
         c.id,
         c.name,
         c.description,
         c.image_url,
         c.start_date,
         c.end_date,
         b.id AS business_id,
         b.trade_name AS business_name,
         b.logo_url AS business_logo,
         w.id AS warehouse_id,
         w.address,
         w.lat AS warehouse_lat,
         w.lng AS warehouse_lng,
         w.working_hours,
         earth_distance(
           ll_to_earth($1, $2),
           ll_to_earth(w.lat, w.lng)
         ) AS distance_meters
       FROM campaign c
       JOIN business b ON b.id = c.business_id
       JOIN warehouse w ON w.id = c.warehouse_id
       WHERE c.is_active = true
         AND (c.end_date IS NULL OR c.end_date > NOW())
         AND earth_distance(
               ll_to_earth($1, $2),
               ll_to_earth(w.lat, w.lng)
             ) <= $3
       ORDER BY distance_meters ASC`,
      [lat, lng, radiusMeters]
    );

    const stores = rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      imageUrl: row.image_url,
      startDate: row.start_date,
      endDate: row.end_date,
      business: {
        id: row.business_id,
        name: row.business_name,
        logo: row.business_logo,
      },
      warehouse: {
        id: row.warehouse_id,
        address: row.address,
        lat: row.warehouse_lat,
        lng: row.warehouse_lng,
        workingHours: row.working_hours,
      },
      distance: Math.round(row.distance_meters),
    }));

    res.json({ stores, count: stores.length });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /:id
 * Store detail. Campaign with business, warehouse, and categories that have products.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rows: campaigns } = await query(
      `SELECT
         c.id,
         c.name,
         c.description,
         c.image_url,
         c.start_date,
         c.end_date,
         c.is_active,
         b.id AS business_id,
         b.trade_name AS business_name,
         b.logo_url AS business_logo,
         b.description AS business_description,
         w.id AS warehouse_id,
         w.address,
         w.lat,
         w.lng,
         w.working_hours,
         w.phone
       FROM campaign c
       JOIN business b ON b.id = c.business_id
       JOIN warehouse w ON w.id = c.warehouse_id
       WHERE c.id = $1`,
      [id]
    );

    if (campaigns.length === 0) {
      throw new AppError('Store not found', 'not_found');
    }

    const camp = campaigns[0];

    const { rows: categories } = await query(
      `SELECT DISTINCT cat.id, cat.name, cat.slug, cat.sort_order
       FROM category cat
       JOIN product_category pc ON pc.category_id = cat.id
       JOIN offer o ON o.product_id = pc.product_id
       WHERE o.campaign_id = $1 AND o.is_active = true
       ORDER BY cat.sort_order, cat.name`,
      [id]
    );

    res.json({
      id: camp.id,
      name: camp.name,
      description: camp.description,
      imageUrl: camp.image_url,
      startDate: camp.start_date,
      endDate: camp.end_date,
      isActive: camp.is_active,
      business: {
        id: camp.business_id,
        name: camp.business_name,
        logo: camp.business_logo,
        description: camp.business_description,
      },
      warehouse: {
        id: camp.warehouse_id,
        address: camp.address,
        lat: camp.lat,
        lng: camp.lng,
        workingHours: camp.working_hours,
        phone: camp.phone,
      },
      categories,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /:id/products
 * Products for a store/campaign.
 * Query: category, sort (price_asc, price_desc, expiry_asc, discount_desc), cursor, limit (default 20)
 */
router.get('/:id/products', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category, sort, cursor } = req.query;
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);

    const validSorts = ['price_asc', 'price_desc', 'expiry_asc', 'discount_desc'];
    const sortBy = validSorts.includes(sort) ? sort : 'price_asc';

    const params = [id, limit + 1];
    let paramIdx = 3;

    let categoryFilter = '';
    if (category) {
      categoryFilter = `AND EXISTS (
        SELECT 1 FROM product_category pc2
        WHERE pc2.product_id = o.product_id AND pc2.category_id = $${paramIdx}
      )`;
      params.push(category);
      paramIdx++;
    }

    let cursorFilter = '';
    if (cursor) {
      cursorFilter = `AND o.id > $${paramIdx}`;
      params.push(cursor);
      paramIdx++;
    }

    let orderClause;
    switch (sortBy) {
      case 'price_desc':
        orderClause = 'op.price DESC, o.id ASC';
        break;
      case 'expiry_asc':
        orderClause = 's.expires_at ASC NULLS LAST, o.id ASC';
        break;
      case 'discount_desc':
        orderClause = 'discount_pct DESC NULLS LAST, o.id ASC';
        break;
      default:
        orderClause = 'op.price ASC, o.id ASC';
    }

    const { rows } = await query(
      `SELECT
         o.id AS offer_id,
         o.product_id,
         p.name,
         p.brand,
         p.weight,
         p.weight_unit,
         p.barcode,
         op.price,
         op.original_price,
         CASE
           WHEN op.original_price > 0
           THEN ROUND((1 - op.price / op.original_price) * 100)
           ELSE 0
         END AS discount_pct,
         s.quantity AS stock_quantity,
         s.expires_at,
         (SELECT pi.url FROM product_image pi WHERE pi.product_id = p.id ORDER BY pi.sort_order LIMIT 1) AS image_url
       FROM offer o
       JOIN product p ON p.id = o.product_id
       LEFT JOIN offer_price op ON op.offer_id = o.id
       LEFT JOIN stock s ON s.offer_id = o.id AND s.warehouse_id = (
         SELECT warehouse_id FROM campaign WHERE id = $1
       )
       WHERE o.campaign_id = $1
         AND o.is_active = true
         ${categoryFilter}
         ${cursorFilter}
       ORDER BY ${orderClause}
       LIMIT $2`,
      params
    );

    const hasMore = rows.length > limit;
    const products = rows.slice(0, limit);
    const nextCursor = hasMore ? products[products.length - 1].offer_id : null;

    res.json({
      products: products.map(p => ({
        offerId: p.offer_id,
        productId: p.product_id,
        name: p.name,
        brand: p.brand,
        weight: p.weight,
        weightUnit: p.weight_unit,
        barcode: p.barcode,
        price: parseFloat(p.price),
        originalPrice: parseFloat(p.original_price),
        discountPercent: parseInt(p.discount_pct) || 0,
        stockQuantity: p.stock_quantity,
        expiresAt: p.expires_at,
        imageUrl: p.image_url,
      })),
      nextCursor,
      hasMore,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
