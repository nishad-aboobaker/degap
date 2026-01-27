const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Course ID is required"],
            index: true,
        },
        submittedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Submitter User ID is required"],
            index: true,
        },
        status: {
            type: String,
            enum: [
                "submitted",
                "under_review",
                "approved",
                "rejected",
                "changes_requested",
            ],
            default: "submitted",
            index: true,
        },
        // Review fields
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        reviewedAt: {
            type: Date,
        },
        reviewNotes: {
            type: String,
        },
        rejectionReason: {
            type: String,
        },
        changesRequested: {
            type: String, // Feedback for resubmission
        },
        // History (for tracking changes)
        history: [
            {
                status: {
                    type: String,
                },
                reviewedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                reviewedAt: {
                    type: Date,
                },
                notes: {
                    type: String,
                },
            },
        ],
        submittedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
submissionSchema.index({ submittedAt: -1 }); // For sorting by submission date

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = Submission;
