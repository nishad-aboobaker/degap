const User = require("../models/User");
const {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    generateRandomToken,
    hashToken,
} = require("../utils/token.util");
const {
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendWelcomeEmail,
} = require("../services/email.service");
const { logger } = require("../utils/logger");

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: {
                    code: "USER_EXISTS",
                    message: "User with this email already exists",
                },
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            authProvider: "email",
        });

        // Generate email verification token
        const verificationToken = generateRandomToken();
        const hashedToken = hashToken(verificationToken);

        user.emailVerificationToken = hashedToken;
        user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        await user.save();

        // Send verification email
        await sendVerificationEmail(user, verificationToken);

        res.status(201).json({
            success: true,
            message:
                "Registration successful! Please check your email to verify your account.",
            data: {
                user: user.toPublicProfile(),
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        // Find user and include password
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: "INVALID_CREDENTIALS",
                    message: "Invalid email or password",
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

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: {
                    code: "INVALID_CREDENTIALS",
                    message: "Invalid email or password",
                },
            });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user.toJWTPayload());
        const refreshToken = generateRefreshToken({ id: user._id });

        // Store refresh token (hashed)
        const hashedRefreshToken = hashToken(refreshToken);
        user.refreshTokens.push({
            token: hashedRefreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });

        // Limit number of active sessions (e.g., 5)
        if (user.refreshTokens.length > 5) {
            user.refreshTokens.shift(); // Remove oldest
        }

        await user.save();

        // Set httpOnly cookies
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({
            success: true,
            message: "Login successful",
            data: {
                user: user.toPublicProfile(),
                accessToken, // Also send in response for non-cookie clients
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
async function logout(req, res, next) {
    try {
        const { refreshToken } = req.cookies;

        if (refreshToken) {
            const hashedRefreshToken = hashToken(refreshToken);
            
            // Remove token from database if user is authenticated/identifiable
            // If we have req.user from authenticate middleware, use it.
            // But logout endpoint is protected? Yes, according to routes.
            // Wait, auth.routes.js says: router.post("/logout", authenticate, logout);
            
            if (req.user) {
                await User.findByIdAndUpdate(req.user.id, {
                    $pull: { refreshTokens: { token: hashedRefreshToken } }
                });
            }
        }

        // Clear cookies
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        res.json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        next(error);
    }
}

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
async function forgotPassword(req, res, next) {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            // Don't reveal if user exists
            return res.json({
                success: true,
                message: "If an account exists, a password reset email has been sent.",
            });
        }

        // Generate reset token
        const resetToken = generateRandomToken();
        const hashedToken = hashToken(resetToken);

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
        await user.save();

        // Send reset email
        await sendPasswordResetEmail(user, resetToken);

        res.json({
            success: true,
            message: "If an account exists, a password reset email has been sent.",
        });
    } catch (error) {
        next(error);
    }
}

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
async function resetPassword(req, res, next) {
    try {
        const { token, password } = req.body;

        const hashedToken = hashToken(token);

        // Find user with valid reset token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        }).select("+resetPasswordToken +resetPasswordExpire");

        if (!user) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "INVALID_TOKEN",
                    message: "Invalid or expired reset token",
                },
            });
        }

        // Update password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        logger.info(`Password reset successful for user: ${user.email}`);

        res.json({
            success: true,
            message: "Password reset successful. You can now login with your new password.",
        });
    } catch (error) {
        next(error);
    }
}

/**
 * @route   GET /api/auth/verify-email/:token
 * @desc    Verify email address
 * @access  Public
 */
async function verifyEmail(req, res, next) {
    try {
        const { token } = req.params;

        const hashedToken = hashToken(token);

        // Find user with valid verification token
        const user = await User.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpire: { $gt: Date.now() },
        }).select("+emailVerificationToken +emailVerificationExpire");

        if (!user) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "INVALID_TOKEN",
                    message: "Invalid or expired verification token",
                },
            });
        }

        // Mark email as verified
        user.emailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpire = undefined;
        await user.save();

        // Send welcome email
        await sendWelcomeEmail(user);

        logger.info(`Email verified for user: ${user.email}`);

        res.json({
            success: true,
            message: "Email verified successfully! You can now login.",
        });
    } catch (error) {
        next(error);
    }
}

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public (requires refresh token)
 */
async function refreshToken(req, res, next) {
    try {
        const { refreshToken: token } = req.cookies;

        if (!token) {
            return res.status(401).json({
                success: false,
                error: {
                    code: "NO_REFRESH_TOKEN",
                    message: "Refresh token not found",
                },
            });
        }

        // Verify refresh token
        const decoded = verifyToken(token, process.env.JWT_REFRESH_SECRET);

        // Find user
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: "USER_NOT_FOUND",
                    message: "User not found",
                },
            });
        }

        // Verify refresh token exists in database
        const hashedRefreshToken = hashToken(token);
        const tokenExists = user.refreshTokens.find(
            (t) => t.token === hashedRefreshToken
        );

        if (!tokenExists) {
            // Token reuse detection or revocation
            return res.status(401).json({
                success: false,
                error: {
                    code: "INVALID_REFRESH_TOKEN",
                    message: "Refresh token is invalid or has been revoked",
                },
            });
        }

        // Generate new access token
        const accessToken = generateAccessToken(user.toJWTPayload());

        // Set new access token cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.json({
            success: true,
            message: "Token refreshed successfully",
            data: {
                accessToken,
            },
        });
    } catch (error) {
        if (error.message === "Token has expired" || error.message === "Invalid token") {
            return res.status(401).json({
                success: false,
                error: {
                    code: "INVALID_REFRESH_TOKEN",
                    message: error.message,
                },
            });
        }
        next(error);
    }
}

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
async function getCurrentUser(req, res, next) {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "USER_NOT_FOUND",
                    message: "User not found",
                },
            });
        }

        res.json({
            success: true,
            data: {
                user: user.toPublicProfile(),
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * @route   GET /api/auth/google/callback
 * @route   GET /api/auth/github/callback
 * @desc    Common OAuth callback handler – issues JWT cookies
 * @access  Public (invoked after Passport OAuth success)
 */
async function loginWithOAuth(req, res, next) {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: "OAUTH_FAILED",
                    message: "OAuth authentication failed",
                },
            });
        }

        const accessToken = generateAccessToken(user.toJWTPayload());
        const refreshToken = generateRefreshToken({ id: user._id });

        const hashedRefreshToken = hashToken(refreshToken);
        user.refreshTokens.push({
            token: hashedRefreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        if (user.refreshTokens.length > 5) {
            user.refreshTokens.shift();
        }

        await user.save();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Redirect back to frontend after successful OAuth login
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        res.redirect(frontendUrl);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    refreshToken,
    getCurrentUser,
    loginWithOAuth,
};
