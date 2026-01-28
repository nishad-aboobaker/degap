const mongoose = require("mongoose");
const slugify = require("slugify");

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: [100, "Title cannot exceed 100 characters"],
        },
        slug: {
            type: String,
            unique: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            maxlength: [2000, "Description cannot exceed 2000 characters"],
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
            index: true,
        },
        // Legacy field name for technology stack; kept for backward compatibility
        technologies: [
            {
                type: String,
                trim: true,
            },
        ],
        // Canonical technology stack field per DESIGN/PRD
        technologyStack: [
            {
                type: String,
                trim: true,
            },
        ],
        difficulty: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
            required: [true, "Difficulty level is required"],
        },
        prerequisites: [
            {
                type: String,
                trim: true,
            },
        ],
        estimatedDuration: {
            type: Number,
            min: [0, "Duration must be positive"],
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        thumbnail: {
            type: String,
            default: null,
        },
        status: {
            type: String,
            enum: [
                "draft",
                "submitted",
                "under_review",
                "approved",
                "rejected",
                "taken_down",
            ],
            default: "draft",
            index: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        approvedAt: {
            type: Date,
        },
        rejectionReason: {
            type: String,
        },
        // Co-ownership support per DESIGN/PRD
        coOwners: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                addedAt: {
                    type: Date,
                    default: Date.now,
                },
                addedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
            },
        ],
        viewCount: {
            type: Number,
            default: 0,
        },
        favoriteCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes for search and filtering
courseSchema.index({ title: "text", description: "text" });
courseSchema.index({ technologies: 1 });
courseSchema.index({ technologyStack: 1 });
courseSchema.index({ category: 1, status: 1 });

// Create course slug from the title
courseSchema.pre("save", function (next) {
    // Temporary disable to debug 500 error
    if (this.isModified("title") && typeof slugify === 'function') {
        this.slug = slugify(this.title, { lower: true });
    }
    if (typeof next === 'function') {
        next();
    }
});

// Virtual for getting roadmaps associated with this course
courseSchema.virtual("roadmaps", {
    ref: "Roadmap",
    localField: "_id",
    foreignField: "courseId",
    justOne: false,
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
