const { z } = require("zod");

// Register validation schema
const registerSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name cannot exceed 50 characters")
        .trim(),
    email: z.string().email("Invalid email address").toLowerCase().trim(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        ),
});

// Login validation schema
const loginSchema = z.object({
    email: z.string().email("Invalid email address").toLowerCase().trim(),
    password: z.string().min(1, "Password is required"),
});

// Forgot password validation schema
const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address").toLowerCase().trim(),
});

// Reset password validation schema
const resetPasswordSchema = z.object({
    token: z.string().min(1, "Reset token is required"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        ),
});

// Update profile validation schema
const updateProfileSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name cannot exceed 50 characters")
        .trim()
        .optional(),
    bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
    profilePicture: z.string().url("Invalid profile picture URL").optional(),
});

// Change password validation schema
const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        ),
});

/**
 * Validation middleware factory
 * @param {z.ZodSchema} schema - Zod validation schema
 * @returns {Function} Express middleware
 */
function validate(schema) {
    return (req, res, next) => {
        try {
            const validated = schema.parse(req.body);
            req.body = validated; // Replace with validated data
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: "VALIDATION_ERROR",
                        message: "Validation failed",
                        details: error.errors.map((err) => ({
                            field: err.path.join("."),
                            message: err.message,
                        })),
                    },
                });
            }
            next(error);
        }
    };
}

module.exports = {
    validate,
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    updateProfileSchema,
    changePasswordSchema,
};
