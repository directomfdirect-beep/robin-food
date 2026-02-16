const express = require('express');
const router = express.Router();
const { query } = require('../db');
const { optionalAuth } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');

/**
 * GET /:id
 * Product detail by offer ID.
 * Joins offer, offer_price, stock, product_image, categories, КБЖУ fields.
 * optionalAuth to include isFavorite for authenticated users.
 */
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rows } = await query(
      `SELECT
         o.id AS offer_id,
         o.campaign_id,
         o.is_active AS offer_active,
         p.id AS product_id,
         p.name,
         p.brand,
         p.description,
         p.weight,
         p.weight_unit,
         p.barcode,
         p.country_of_origin,
         p.calories,
         p.proteins,
         p.fats,
         p.carbohydrates,
         p.ingredients,
         p.storage_conditions,
         op.price,
         op.original_price,
         CASE
           WHEN op.original_price > 0
           THEN ROUND((1 - op.price / op.original_price) * 100)
           ELSE 0
         END AS discount_pct,
         s.quantity AS stock_quantity,
         s.expires_at,
         c.name AS campaign_name,
         w.address AS warehouse_address
       FROM offer o
       JOIN product p ON p.id = o.product_id
       LEFT JOIN offer_price op ON op.offer_id = o.id
       LEFT JOIN stock s ON s.offer_id = o.id AND s.warehouse_id = (
         SELECT warehouse_id FROM campaign WHERE id = o.campaign_id
       )
       LEFT JOIN campaign c ON c.id = o.campaign_id
       LEFT JOIN warehouse w ON w.id = c.warehouse_id
       WHERE o.id = $1`,
      [id]
    );

    if (rows.length === 0) {
      throw new AppError('Product not found', 'not_found');
    }

    const product = rows[0];

    const { rows: images } = await query(
      `SELECT id, url, alt_text, sort_order
       FROM product_image
       WHERE product_id = $1
       ORDER BY sort_order ASC`,
      [product.product_id]
    );

    const { rows: categories } = await query(
      `SELECT cat.id, cat.name, cat.slug
       FROM category cat
       JOIN product_category pc ON pc.category_id = cat.id
       WHERE pc.product_id = $1
       ORDER BY cat.name`,
      [product.product_id]
    );

    let isFavorite = false;
    if (req.user) {
      const { rows: favRows } = await query(
        `SELECT 1 FROM favorite
         WHERE user_id = $1 AND offer_id = $2`,
        [req.user.id, id]
      );
      isFavorite = favRows.length > 0;
    }

    res.json({
      offerId: product.offer_id,
      campaignId: product.campaign_id,
      campaignName: product.campaign_name,
      warehouseAddress: product.warehouse_address,
      offerActive: product.offer_active,
      product: {
        id: product.product_id,
        name: product.name,
        brand: product.brand,
        description: product.description,
        weight: product.weight,
        weightUnit: product.weight_unit,
        barcode: product.barcode,
        countryOfOrigin: product.country_of_origin,
        nutrition: {
          calories: product.calories,
          proteins: product.proteins,
          fats: product.fats,
          carbohydrates: product.carbohydrates,
        },
        ingredients: product.ingredients,
        storageConditions: product.storage_conditions,
      },
      price: product.price ? parseFloat(product.price) : null,
      originalPrice: product.original_price ? parseFloat(product.original_price) : null,
      discountPercent: parseInt(product.discount_pct) || 0,
      stockQuantity: product.stock_quantity,
      expiresAt: product.expires_at,
      images,
      categories,
      isFavorite,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
