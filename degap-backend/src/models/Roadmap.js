const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Course ID is required"],
            index: true,
        },
        title: {
            type: String,
            required: [true, "Roadmap title is required"],
            trim: true,
            maxlength: [100, "Title cannot exceed 100 characters"],
        },
        description: {
            type: String,
            maxlength: [2000, "Description cannot exceed 2000 characters"],
        },
        steps: [
            {
                stepNumber: {
                    type: Number,
                    required: [true, "Step number is required"],
                },
                title: {
                    type: String,
                    required: [true, "Step title is required"],
                    trim: true,
                },
                description: {
                    type: String,
                },
                estimatedTime: {
                    type: Number, // in hours
                    min: 0,
                },
                difficultyLevel: {
                    type: String,
                    enum: ["beginner", "intermediate", "advanced"],
                },
                resources: [
                    {
                        type: {
                            type: String,
                            enum: [
                                "article",
                                "video",
                                "documentation",
                                "course",
                                "project",
                                "book",
                            ],
                            required: true,
                        },
                        title: {
                            type: String,
                            required: true,
                            trim: true,
                        },
                        url: {
                            type: String,
                            required: true,
                            trim: true,
                        },
                        description: {
                            type: String,
                        },
                    },
                ],
                exercises: [
                    {
                        title: {
                            type: String,
                            trim: true,
                        },
                        description: {
                            type: String,
                        },
                        url: {
                            type: String,
                            trim: true,
                        },
                    },
                ],
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Roadmap = mongoose.model("Roadmap", roadmapSchema);

module.exports = Roadmap;
