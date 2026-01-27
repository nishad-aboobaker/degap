const { verifyToken } = require("../utils/token.util");
const User = require("../models/User");
const { env } = require("../config/env");

/**
 * Authenticate user via JWT token
 * Checks for token in cookies or Authorization header
 */
async function authenticate(req, res, next) {
    try {
        let token;

        // Check for token in cookies first
        if (req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }
        // Check Authorization header as fallback
        else if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                error: {
                    code: "NO_TOKEN",
                    message: "Authentication required. Please login.",
                },
            });
        }

        // Verify token
        const decoded = verifyToken(token, env.JWT_SECRET);

        // Find user
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: "USER_NOT_FOUND",
                    message: "User not found. Please login again.",
                },
            });
        }

        // Check if account is active
        if (user.accountStatus !== "active") {
            return res.status(403).json({
                success: false,
                error: {
                    code: "ACCOUNT_SUSPENDED",
                    message: `Your account has been ${user.accountStatus}. Please contact support.`,
                },
            });
        }

        // Attach user to request
        req.user = {
            id: user._id,
            email: user.email,
            role: user.role,
            emailVerified: user.emailVerified,
        };

        next();
    } catch (error) {
        if (error.message === "Token has expired") {
            return res.status(401).json({
                success: false,
                error: {
                    code: "TOKEN_EXPIRED",
                    message: "Session expired. Please login again.",
                },
            });
        }
        if (error.message === "Invalid token") {
            return res.status(401).json({
                success: false,
                error: {
                    code: "INVALID_TOKEN",
                    message: "Invalid authentication token. Please login again.",
                },
            });
        }
        next(error);
    }
}

/**
 * Authorize user based on roles
 * @param {...String} roles - Allowed roles
 */
function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: "UNAUTHORIZED",
                    message: "Authentication required",
                },
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: {
                    code: "FORBIDDEN",
                    message: "You do not have permission to perform this action",
                },
            });
        }

        next();
    };
}

/**
 * Require email verification
 */
function requireEmailVerification(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: {
                code: "UNAUTHORIZED",
                message: "Authentication required",
            },
        });
    }

    if (!req.user.emailVerified) {
        return res.status(403).json({
            success: false,
            error: {
                code: "EMAIL_NOT_VERIFIED",
                message: "Please verify your email address to access this feature",
            },
        });
    }

    next();
}

/**
 * Optional authentication - attach user if token exists, but don't require it
 */
async function optionalAuth(req, res, next) {
    try {
        let token;

        if (req.cookies.accessToken) {
            token = req.cookies.accessToken;
        } else if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return next();
        }

        const decoded = verifyToken(token, env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (user && user.accountStatus === "active") {
            req.user = {
                id: user._id,
                email: user.email,
                role: user.role,
                emailVerified: user.emailVerified,
            };
        }

        next();
    } catch (error) {
        // Ignore errors for optional auth
        next();
    }
}

module.exports = {
    authenticate,
    authorize,
    requireEmailVerification,
    optionalAuth,
};
