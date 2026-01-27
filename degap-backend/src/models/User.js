const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [50, "Name cannot exceed 50 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please provide a valid email",
            ],
        },
        password: {
            type: String,
            required: function () {
                return this.authProvider === "email";
            },
            minlength: [8, "Password must be at least 8 characters"],
            select: false, // Don't return password by default
        },
        authProvider: {
            type: String,
            enum: ["email", "google", "github"],
            default: "email",
        },
        authProviderId: {
            type: String,
            sparse: true, // Allow null but unique if present
        },
        profilePicture: {
            type: String,
            default: null,
        },
        bio: {
            type: String,
            maxlength: [500, "Bio cannot exceed 500 characters"],
            default: "",
        },
        role: {
            type: String,
            enum: ["student", "contributor", "admin"],
            default: "student",
        },
        accountStatus: {
            type: String,
            enum: ["active", "suspended", "banned"],
            default: "active",
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        emailVerificationToken: {
            type: String,
            select: false,
        },
        emailVerificationExpire: {
            type: Date,
            select: false,
        },
        resetPasswordToken: {
            type: String,
            select: false,
        },
        resetPasswordExpire: {
            type: Date,
            select: false,
        },
        refreshTokens: [
            {
                token: { type: String, required: true },
                createdAt: { type: Date, default: Date.now },
                expiresAt: { type: Date, required: true },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Indexes
userSchema.index({ authProviderId: 1, authProvider: 1 });

// Pre-save middleware to hash password
userSchema.pre("save", async function () {
    // Only hash password if it's modified or new
    if (!this.isModified("password")) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error("Password comparison failed");
    }
};

// Method to get public profile (exclude sensitive data)
userSchema.methods.toPublicProfile = function () {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        profilePicture: this.profilePicture,
        bio: this.bio,
        role: this.role,
        emailVerified: this.emailVerified,
        createdAt: this.createdAt,
    };
};

// Method to get minimal profile for JWT
userSchema.methods.toJWTPayload = function () {
    return {
        id: this._id,
        email: this.email,
        role: this.role,
        emailVerified: this.emailVerified,
    };
};

const User = mongoose.model("User", userSchema);

module.exports = User;
