const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { env } = require("../config/env");

/**
 * Generate JWT access token
 * @param {Object} payload - Token payload (userId, email, role)
 * @returns {String} JWT token
 */
function generateAccessToken(payload) {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRE || "15m",
    });
}

/**
 * Generate JWT refresh token
 * @param {Object} payload - Token payload (userId)
 * @returns {String} JWT refresh token
 */
function generateRefreshToken(payload) {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRE || "7d",
    });
}

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @param {String} secret - Secret key (access or refresh)
 * @returns {Object} Decoded token payload
 */
function verifyToken(token, secret) {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new Error("Token has expired");
        }
        if (error.name === "JsonWebTokenError") {
            throw new Error("Invalid token");
        }
        throw error;
    }
}

/**
 * Generate random token for email verification/password reset
 * @returns {String} Random hex token
 */
function generateRandomToken() {
    return crypto.randomBytes(32).toString("hex");
}

/**
 * Hash token for storage
 * @param {String} token - Token to hash
 * @returns {String} Hashed token
 */
function hashToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    generateRandomToken,
    hashToken,
};
