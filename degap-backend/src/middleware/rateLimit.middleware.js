const rateLimit = require("express-rate-limit");
const { env } = require("../config/env");

/**
 * General API rate limiter
 * Limits requests from same IP
 */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        success: false,
        error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "Too many requests, please try again later.",
        },
    },
});

/**
 * Auth rate limiter (stricter)
 * For login, register, password reset endpoints
 */
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // Limit each IP to 20 requests per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: {
            code: "AUTH_RATE_LIMIT_EXCEEDED",
            message: "Too many login attempts, please try again later.",
        },
    },
});

/**
 * Account creation rate limiter
 */
const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 account creations per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: {
            code: "ACCOUNT_CREATION_LIMIT",
            message: "Too many accounts created from this IP, please try again later.",
        },
    },
});

module.exports = {
    apiLimiter,
    authLimiter,
    createAccountLimiter,
};
