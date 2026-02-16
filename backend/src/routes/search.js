const express = require('express');
const router = express.Router();
const { query } = require('../db');
const { AppError } = require('../middleware/errorHandler');

/**
 * GET /
 * Unified search for products and stores.
 * Query: q (required), type (product/store/all, default 'all'), limit (default 20)
 * Products: FTS with plainto_tsquery('russian'), fallback to trigram similarity.
 * Stores: search campaigns.name.
 */
router.get('/', async (req, res, next) => {
  try {
    const { q, type } = req.query;
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 50);

    if (!q || q.trim().length === 0) {
      throw new AppError('Search query "q" is required', 'validation');
    }

    const searchQuery = q.trim();
    const searchType = ['product', 'store'].includes(type) ? type : 'all';

    let products = [];
    let stores = [];

    if (searchType === 'all' || searchType === 'product') {
      const { rows: ftsProducts } = await query(
        `SELECT
           o.id AS offer_id,
           p.id AS product_id,
           p.name,
           p.brand,
           p.weight,
           p.weight_unit,
           op.price,
           op.original_price,
           CASE
             WHEN op.original_price > 0
             THEN ROUND((1 - op.price / op.original_price) * 100)
             ELSE 0
           END AS discount_pct,
           s.quantity AS stock_quantity,
           s.expires_at,
           (SELECT pi.url FROM product_image pi WHERE pi.product_id = p.id ORDER BY pi.sort_order LIMIT 1) AS image_url,
           ts_rank(p.search_vector, plainto_tsquery('russian', $1)) AS fts_rank,
           similarity(p.name, $1) AS trgm_score
         FROM offer o
         JOIN product p ON p.id = o.product_id
         LEFT JOIN offer_price op ON op.offer_id = o.id
         LEFT JOIN stock s ON s.offer_id = o.id AND s.warehouse_id = (
           SELECT warehouse_id FROM campaign WHERE id = o.campaign_id
         )
         WHERE o.is_active = true
           AND (
             p.search_vector @@ plainto_tsquery('russian', $1)
             OR similarity(p.name, $1) > 0.15
           )
         ORDER BY
           CASE WHEN p.search_vector @@ plainto_tsquery('russian', $1) THEN 0 ELSE 1 END,
           fts_rank DESC,
           trgm_score DESC
         LIMIT $2`,
        [searchQuery, limit]
      );

      products = ftsProducts.map(p => ({
        offerId: p.offer_id,
        productId: p.product_id,
        name: p.name,
        brand: p.brand,
        weight: p.weight,
        weightUnit: p.weight_unit,
        price: p.price ? parseFloat(p.price) : null,
        originalPrice: p.original_price ? parseFloat(p.original_price) : null,
        discountPercent: parseInt(p.discount_pct) || 0,
        stockQuantity: p.stock_quantity,
        expiresAt: p.expires_at,
        imageUrl: p.image_url,
      }));
    }

    if (searchType === 'all' || searchType === 'store') {
      const { rows: storeRows } = await query(
        `SELECT
           c.id,
           c.name,
           c.description,
           c.image_url,
           b.trade_name AS business_name,
           b.logo_url AS business_logo,
           w.address,
           similarity(c.name, $1) AS score
         FROM campaign c
         JOIN business b ON b.id = c.business_id
         JOIN warehouse w ON w.id = c.warehouse_id
         WHERE c.is_active = true
           AND (
             c.name ILIKE '%' || $1 || '%'
             OR similarity(c.name, $1) > 0.15
           )
         ORDER BY score DESC
         LIMIT $2`,
        [searchQuery, limit]
      );

      stores = storeRows.map(s => ({
        id: s.id,
        name: s.name,
        description: s.description,
        imageUrl: s.image_url,
        businessName: s.business_name,
        businessLogo: s.business_logo,
        address: s.address,
      }));
    }

    res.json({ products, stores });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /suggest
 * Autocomplete suggestions using trigram similarity.
 * Query: q (required). Returns top 7 suggestions.
 */
router.get('/suggest', async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({ suggestions: [] });
    }

    const searchQuery = q.trim();

    const { rows } = await query(
      `SELECT DISTINCT p.name, similarity(p.name, $1) AS score
       FROM product p
       JOIN offer o ON o.product_id = p.id AND o.is_active = true
       WHERE similarity(p.name, $1) > 0.1
          OR p.name ILIKE $2
       ORDER BY score DESC
       LIMIT 7`,
      [searchQuery, `%${searchQuery}%`]
    );

    res.json({
      suggestions: rows.map(r => r.name),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
