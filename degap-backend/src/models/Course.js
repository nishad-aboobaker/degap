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
        technologies: [
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
        thumbnail: {
            type: String,
            default: null,
        },
        status: {
            type: String,
            enum: ["draft", "submitted", "approved", "rejected"],
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
