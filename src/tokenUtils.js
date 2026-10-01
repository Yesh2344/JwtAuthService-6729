import jwt from 'jsonwebtoken';
import { config } from './config.js';
import logger from './logger.js';

/**
 * Sign a JWT access token.
 * @param {Object} payload Payload to embed (e.g., user id, email)
 * @returns {string} Signed JWT
 */
export function signAccessToken(payload) {
  try {
    return jwt.sign(payload, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessTtl,
    });
  } catch (err) {
    logger.error('Failed to sign access token', err);
    throw err;
  }
}

/**
 * Sign a JWT refresh token.
 * @param {Object} payload Payload to embed
 * @returns {string} Signed JWT
 */
export function signRefreshToken(payload) {
  try {
    return jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshTtl,
    });
  } catch (err) {
    logger.error('Failed to sign refresh token', err);
    throw err;
  }
}

/**
 * Verify an access token.
 * @param {string} token JWT string
 * @returns {Object} Decoded payload
 * @throws {Error} If verification fails
 */
export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, config.jwt.accessSecret);
  } catch (err) {
    logger.warn('Invalid access token', err);
    throw err;
  }
}

/**
 * Verify a refresh token.
 * @param {string} token JWT string
 * @returns {Object} Decoded payload
 * @throws {Error} If verification fails
 */
export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, config.jwt.refreshSecret);
  } catch (err) {
    logger.warn('Invalid refresh token', err);
    throw err;
  }
}