const express = require('express');
const router = express.Router();
const { query } = require('../db');
const { authenticate, generateTokens } = require('../middleware/auth');
const { otpLimiter, otpDailyLimiter } = require('../middleware/rateLimit');
const { AppError } = require('../middleware/errorHandler');
const { sendSms, generateOtp } = require('../services/sms');

const PHONE_REGEX = /^\+7\d{10}$/;

/**
 * POST /send-otp
 * Validate phone, generate 6-digit OTP, insert into otp_session with 2-min TTL.
 */
router.post('/send-otp', otpLimiter, otpDailyLimiter, async (req, res, next) => {
  try {
    const { phone } = req.body;

    if (!phone || !PHONE_REGEX.test(phone)) {
      throw new AppError('Invalid phone number. Expected format: +7XXXXXXXXXX', 'validation');
    }

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    await query(
      `INSERT INTO otp_session (phone, code, expires_at, attempts, created_at)
       VALUES ($1, $2, $3, 0, NOW())`,
      [phone, code, expiresAt]
    );

    await sendSms(phone, `Robin Food: ваш код ${code}`);

    res.json({ success: true, message: 'OTP sent', expiresIn: 120 });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /verify-otp
 * Validate OTP code against latest otp_session for phone.
 * Find or create user, generate JWT tokens, store refresh token.
 */
router.post('/verify-otp', async (req, res, next) => {
  try {
    const { phone, code } = req.body;

    if (!phone || !PHONE_REGEX.test(phone)) {
      throw new AppError('Invalid phone number', 'validation');
    }
    if (!code || !/^\d{6}$/.test(code)) {
      throw new AppError('Invalid OTP code. Must be 6 digits', 'validation');
    }

    const { rows: sessions } = await query(
      `SELECT id, code, attempts, expires_at
       FROM otp_session
       WHERE phone = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [phone]
    );

    if (sessions.length === 0) {
      throw new AppError('No OTP session found. Request a new code', 'validation');
    }

    const session = sessions[0];

    if (session.attempts >= 3) {
      throw new AppError('Too many attempts. Request a new code', 'rate_limit');
    }

    if (new Date(session.expires_at) < new Date()) {
      throw new AppError('OTP expired. Request a new code', 'validation');
    }

    await query(
      `UPDATE otp_session SET attempts = attempts + 1 WHERE id = $1`,
      [session.id]
    );

    if (session.code !== code) {
      throw new AppError('Invalid OTP code', 'validation');
    }

    await query(`DELETE FROM otp_session WHERE phone = $1`, [phone]);

    let isNewUser = false;
    let { rows: users } = await query(
      `SELECT id, phone, name, role FROM app_user WHERE phone = $1`,
      [phone]
    );

    if (users.length === 0) {
      isNewUser = true;
      const { rows: newUsers } = await query(
        `INSERT INTO app_user (phone, role, created_at)
         VALUES ($1, 'customer', NOW())
         RETURNING id, phone, name, role`,
        [phone]
      );
      users = newUsers;
    }

    const user = users[0];
    const tokens = generateTokens(user);

    await query(
      `INSERT INTO refresh_token (user_id, token, expires_at, created_at)
       VALUES ($1, $2, NOW() + INTERVAL '30 days', NOW())`,
      [user.id, tokens.refreshToken]
    );

    res.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
      isNewUser,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /refresh
 * Verify refresh token, find in DB, check not revoked.
 * Generate new token pair, revoke old.
 */
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 'validation');
    }

    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'robin-food-jwt-secret-dev';
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_SECRET);
    } catch (e) {
      throw new AppError('Invalid or expired refresh token', 'auth');
    }

    if (decoded.type !== 'refresh') {
      throw new AppError('Invalid token type', 'auth');
    }

    const { rows: tokens } = await query(
      `SELECT rt.id, rt.user_id, rt.revoked_at, u.phone, u.name, u.role
       FROM refresh_token rt
       JOIN app_user u ON u.id = rt.user_id
       WHERE rt.token = $1`,
      [refreshToken]
    );

    if (tokens.length === 0) {
      throw new AppError('Refresh token not found', 'auth');
    }

    const storedToken = tokens[0];

    if (storedToken.revoked_at) {
      throw new AppError('Refresh token has been revoked', 'auth');
    }

    await query(
      `UPDATE refresh_token SET revoked_at = NOW() WHERE id = $1`,
      [storedToken.id]
    );

    const user = {
      id: storedToken.user_id,
      phone: storedToken.phone,
      name: storedToken.name,
      role: storedToken.role,
    };
    const newTokens = generateTokens(user);

    await query(
      `INSERT INTO refresh_token (user_id, token, expires_at, created_at)
       VALUES ($1, $2, NOW() + INTERVAL '30 days', NOW())`,
      [user.id, newTokens.refreshToken]
    );

    res.json({
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /logout
 * Revoke the provided refresh token for the authenticated user.
 */
router.post('/logout', authenticate, async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 'validation');
    }

    const result = await query(
      `UPDATE refresh_token
       SET revoked_at = NOW()
       WHERE token = $1 AND user_id = $2 AND revoked_at IS NULL`,
      [refreshToken, req.user.id]
    );

    if (result.rowCount === 0) {
      throw new AppError('Refresh token not found or already revoked', 'not_found');
    }

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /logout-all
 * Revoke all refresh tokens for the authenticated user.
 */
router.post('/logout-all', authenticate, async (req, res, next) => {
  try {
    await query(
      `UPDATE refresh_token
       SET revoked_at = NOW()
       WHERE user_id = $1 AND revoked_at IS NULL`,
      [req.user.id]
    );

    res.json({ success: true, message: 'All sessions revoked' });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /register-push
 * Update push_token and push_platform for the authenticated user.
 */
router.post('/register-push', authenticate, async (req, res, next) => {
  try {
    const { pushToken, pushPlatform } = req.body;

    if (!pushToken || typeof pushToken !== 'string') {
      throw new AppError('pushToken is required', 'validation');
    }

    const validPlatforms = ['ios', 'android', 'web'];
    if (!pushPlatform || !validPlatforms.includes(pushPlatform)) {
      throw new AppError(`pushPlatform must be one of: ${validPlatforms.join(', ')}`, 'validation');
    }

    await query(
      `UPDATE app_user SET push_token = $1, push_platform = $2 WHERE id = $3`,
      [pushToken, pushPlatform, req.user.id]
    );

    res.json({ success: true, message: 'Push token registered' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
