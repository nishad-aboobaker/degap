const Submission = require("../models/Submission");
const Course = require("../models/Course");

/**
 * Submit a course for review
 * @route POST /api/submissions
 * @access Private (Instructor only)
 */
async function createSubmission(req, res, next) {
    try {
        const { courseId, notes } = req.body;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "MISSING_FIELDS",
                    message: "Please provide courseId",
                },
            });
        }

        // Verify course exists and user is owner
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "COURSE_NOT_FOUND",
                    message: "Course not found",
                },
            });
        }

        if (course.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: {
                    code: "UNAUTHORIZED",
                    message: "You can only submit your own courses",
                },
            });
        }

        // Check for existing active submission
        const existingSubmission = await Submission.findOne({
            courseId,
            status: { $in: ["submitted", "under_review"] },
        });

        if (existingSubmission) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "ALREADY_SUBMITTED",
                    message: "This course is already submitted or under review",
                },
            });
        }

        const submission = await Submission.create({
            courseId,
            submittedBy: req.user.id,
            status: "submitted",
            history: [
                {
                    status: "submitted",
                    reviewedBy: req.user.id, // Self-action
                    reviewedAt: Date.now(),
                    notes: notes || "Initial submission",
                },
            ],
        });

        res.status(201).json({
            success: true,
            data: submission,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get user's submissions
 * @route GET /api/submissions/my-submissions
 * @access Private
 */
async function getMySubmissions(req, res, next) {
    try {
        const submissions = await Submission.find({ submittedBy: req.user.id })
            .populate("courseId", "title slug status")
            .sort("-submittedAt");

        res.json({
            success: true,
            count: submissions.length,
            data: submissions,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get submission details
 * @route GET /api/submissions/:id
 * @access Private
 */
async function getSubmissionById(req, res, next) {
    try {
        const submission = await Submission.findById(req.params.id).populate(
            "courseId",
            "title slug status thumbnail"
        );

        if (!submission) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "SUBMISSION_NOT_FOUND",
                    message: "Submission not found",
                },
            });
        }

        // Check ownership (allow admin in future)
        if (submission.submittedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: {
                    code: "UNAUTHORIZED",
                    message: "Not authorized to view this submission",
                },
            });
        }

        res.json({
            success: true,
            data: submission,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Resubmit a course (after changes requested)
 * @route PUT /api/submissions/:id
 * @access Private
 */
async function resubmitCourse(req, res, next) {
    try {
        const { notes } = req.body;
        const submission = await Submission.findById(req.params.id);

        if (!submission) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "SUBMISSION_NOT_FOUND",
                    message: "Submission not found",
                },
            });
        }

        if (submission.submittedBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: {
                    code: "UNAUTHORIZED",
                    message: "Not authorized to update this submission",
                },
            });
        }

        // Only allow resubmission if status is changes_requested or rejected
        if (!["changes_requested", "rejected"].includes(submission.status)) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "INVALID_STATUS",
                    message: "Can only resubmit if changes were requested or rejected",
                },
            });
        }

        // Update status
        submission.status = "submitted";
        submission.submittedAt = Date.now(); // Reset submission time
        
        // Add to history
        submission.history.push({
            status: "submitted",
            reviewedBy: req.user.id,
            reviewedAt: Date.now(),
            notes: notes || "Resubmission",
        });

        await submission.save();

        res.json({
            success: true,
            data: submission,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createSubmission,
    getMySubmissions,
    getSubmissionById,
    resubmitCourse,
};
