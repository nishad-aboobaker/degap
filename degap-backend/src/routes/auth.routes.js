const express = require("express");
const {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    refreshToken,
    getCurrentUser,
} = require("../controllers/auth.controller");
const {
    validate,
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} = require("../middleware/validation.middleware");
const { authenticate } = require("../middleware/auth.middleware");
const { authLimiter, createAccountLimiter } = require("../middleware/rateLimit.middleware");

const router = express.Router();

// Public routes
router.post("/register", createAccountLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.get("/verify-email/:token", verifyEmail);
router.post("/refresh-token", refreshToken);

// Protected routes
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getCurrentUser);

module.exports = router;
