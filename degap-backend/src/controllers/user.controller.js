const User = require("../models/User");
const bcrypt = require("bcrypt");
const { validateEmail } = require("../middleware/validation.middleware");

/**
 * Get current user profile
 * @route GET /api/users/profile
 * @access Private
 */
async function getProfile(req, res, next) {
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
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
                bio: user.bio,
                accountStatus: user.accountStatus,
                emailVerified: user.emailVerified,
                authProvider: user.authProvider,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Update current user profile
 * @route PUT /api/users/profile
 * @access Private
 */
async function updateProfile(req, res, next) {
    try {
        const { name, bio, profilePicture } = req.body;
        
        // Basic validation
        if (name && (name.length < 2 || name.length > 50)) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "INVALID_INPUT",
                    message: "Name must be between 2 and 50 characters",
                },
            });
        }

        if (bio && bio.length > 500) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "INVALID_INPUT",
                    message: "Bio cannot exceed 500 characters",
                },
            });
        }

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

        // Update fields if provided
        if (name) user.name = name;
        if (bio !== undefined) user.bio = bio;
        if (profilePicture) user.profilePicture = profilePicture;

        await user.save();

        res.json({
            success: true,
            message: "Profile updated successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
                bio: user.bio,
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get user public profile by ID
 * @route GET /api/users/:id
 * @access Public
 */
async function getUserById(req, res, next) {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "USER_NOT_FOUND",
                    message: "User not found",
                },
            });
        }

        // Return limited public info
        res.json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                role: user.role,
                profilePicture: user.profilePicture,
                bio: user.bio,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        // Handle invalid ObjectId
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                error: {
                    code: "USER_NOT_FOUND",
                    message: "User not found",
                },
            });
        }
        next(error);
    }
}

/**
 * Change password
 * @route PUT /api/users/password
 * @access Private
 */
async function changePassword(req, res, next) {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "MISSING_FIELDS",
                    message: "Current and new password are required",
                },
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "WEAK_PASSWORD",
                    message: "New password must be at least 8 characters",
                },
            });
        }

        const user = await User.findById(req.user.id).select('+password');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "USER_NOT_FOUND",
                    message: "User not found",
                },
            });
        }

        // Check if user has a password (might be OAuth user)
        if (!user.password) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "OAUTH_USER",
                    message: "This account uses social login. Please set a password through settings if you wish to enable email login.",
                },
            });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: {
                    code: "INVALID_PASSWORD",
                    message: "Incorrect current password",
                },
            });
        }

        // Set new password (pre-save hook will hash it)
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Update email
 * @route PUT /api/users/email
 * @access Private
 */
async function updateEmail(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "MISSING_FIELDS",
                    message: "New email is required",
                },
            });
        }

        // Basic email validation regex
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "INVALID_EMAIL",
                    message: "Please provide a valid email",
                },
            });
        }

        const user = await User.findById(req.user.id).select('+password');

        // Verify password for security (if user has password)
        if (user.password) {
            if (!password) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: "MISSING_PASSWORD",
                        message: "Password is required to change email",
                    },
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: "INVALID_PASSWORD",
                        message: "Incorrect password",
                    },
                });
            }
        }

        // Check if email is already taken
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "EMAIL_IN_USE",
                    message: "Email is already in use",
                },
            });
        }

        // Update email and reset verification status
        user.email = email;
        user.emailVerified = false;
        // TODO: Send verification email to new address
        
        await user.save();

        res.json({
            success: true,
            message: "Email updated successfully. Please verify your new email.",
            data: {
                email: user.email,
                emailVerified: user.emailVerified
            }
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Delete account
 * @route DELETE /api/users/account
 * @access Private
 */
async function deleteAccount(req, res, next) {
    try {
        const { password } = req.body;
        const user = await User.findById(req.user.id).select('+password');

        // Verify password if user has one
        if (user.password) {
            if (!password) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: "MISSING_PASSWORD",
                        message: "Password is required to delete account",
                    },
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: "INVALID_PASSWORD",
                        message: "Incorrect password",
                    },
                });
            }
        }

        // Soft delete or hard delete? Let's do hard delete for now as per GDPR right to erasure usually implies it
        // But in many systems we might want to just mark as deleted. 
        // Given the requirement is DELETE /api/users/account, I will remove it.
        // We should also handle related data (cascading delete) but for now let's just delete the user.
        // Actually, let's look at the User model - accountStatus. Maybe we should set it to 'deleted' or remove it.
        // The TODO says "Delete account", let's remove the document.

        await User.deleteOne({ _id: user._id });

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        res.json({
            success: true,
            message: "Account deleted successfully",
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getProfile,
    updateProfile,
    getUserById,
    changePassword,
    updateEmail,
    deleteAccount,
};
