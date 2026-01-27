const { env } = require("../config/env");
const { logger } = require("../utils/logger");

function notFoundHandler(req, res, _next) {
    res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: `Route not found: ${req.method} ${req.originalUrl}` },
    });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
    const status = err.statusCode || err.status || 500;
    const message = err.message || "Internal Server Error";
    
    // Log error
    logger.error(`${status} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    if (status === 500) {
        logger.error(err.stack);
    }

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: {
                code: "VALIDATION_ERROR",
                message: "Validation Error",
                details: Object.values(err.errors).map(val => val.message)
            }
        });
    }

    // Handle Mongoose duplicate key errors
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({
            success: false,
            error: {
                code: "DUPLICATE_ENTRY",
                message: `Duplicate value entered for ${field}`,
            }
        });
    }

    // Handle Mongoose CastError (invalid ID)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            error: {
                code: "INVALID_ID",
                message: `Invalid ${err.path}: ${err.value}`,
            }
        });
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            error: {
                code: "INVALID_TOKEN",
                message: "Invalid token. Please log in again.",
            }
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            error: {
                code: "TOKEN_EXPIRED",
                message: "Your token has expired. Please log in again.",
            }
        });
    }

    res.status(status).json({
        success: false,
        error: {
            code: err.code || "INTERNAL_ERROR",
            message,
            details: env.NODE_ENV === 'development' ? err.stack : undefined,
        },
    });
}

module.exports = { errorHandler, notFoundHandler };


