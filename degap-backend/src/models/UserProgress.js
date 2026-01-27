const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
            index: true,
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Course ID is required"],
            index: true,
        },
        roadmapId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Roadmap",
            required: [true, "Roadmap ID is required"],
        },
        completedSteps: [
            {
                type: Number,
            },
        ],
        progressPercentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        startedAt: {
            type: Date,
            default: Date.now,
        },
        lastAccessedAt: {
            type: Date,
            default: Date.now,
        },
        completedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure a user has only one progress record per course
userProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const UserProgress = mongoose.model("UserProgress", userProgressSchema);

module.exports = UserProgress;
