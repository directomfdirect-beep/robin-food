const router = require('express').Router();
const db = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');

router.use(authenticate);
router.use(requireRole('partner'));

/** POST /settlements/:periodId/dispute — Dispute settlement lines */
router.post('/settlements/:periodId/dispute', async (req, res, next) => {
  try {
    const { periodId } = req.params;
    const { lineIds, reason } = req.body;

    if (!Array.isArray(lineIds) || lineIds.length === 0) {
      return next(new AppError('lineIds must be a non-empty array', 'validation'));
    }
    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
      return next(new AppError('reason is required', 'validation'));
    }

    const period = await db.query(
      `SELECT id, status FROM settlement_period WHERE id = $1`,
      [periodId]
    );
    if (period.rows.length === 0) {
      return next(new AppError('Settlement period not found', 'not_found'));
    }

    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const { rowCount } = await client.query(
        `UPDATE settlement_line
         SET status = 'disputed', dispute_reason = $1, updated_at = NOW()
         WHERE id = ANY($2::uuid[]) AND period_id = $3 AND status != 'disputed'`,
        [reason.trim(), lineIds, periodId]
      );

      if (rowCount > 0) {
        await client.query(
          `UPDATE settlement_period
           SET total_disputed_lines = total_disputed_lines + $1, updated_at = NOW()
           WHERE id = $2`,
          [rowCount, periodId]
        );
      }

      await client.query('COMMIT');

      res.json({
        message: 'Lines disputed successfully',
        disputedCount: rowCount,
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

module.exports = router;
