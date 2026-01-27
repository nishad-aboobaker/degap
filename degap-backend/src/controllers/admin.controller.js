const User = require("../models/User");
const Course = require("../models/Course");
const Submission = require("../models/Submission");

// --- User Management ---

/**
 * Get all users
 * @route GET /api/admin/users
 */
async function getAllUsers(req, res, next) {
    try {
        const users = await User.find().select("-password").sort("-createdAt");
        res.json({ success: true, count: users.length, data: users });
    } catch (error) {
        next(error);
    }
}

/**
 * Get user details
 * @route GET /api/admin/users/:id
 */
async function getUserById(req, res, next) {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                error: { code: "USER_NOT_FOUND", message: "User not found" },
            });
        }
        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
}

/**
 * Update user status/role
 * @route PUT /api/admin/users/:id/status
 */
async function updateUserStatus(req, res, next) {
    try {
        const { role, accountStatus } = req.body;
        
        const updateData = {};
        if (role) updateData.role = role;
        if (accountStatus) updateData.accountStatus = accountStatus;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                error: { code: "USER_NOT_FOUND", message: "User not found" },
            });
        }
        
        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
}

// --- Submission Management ---

/**
 * Get all submissions
 * @route GET /api/admin/submissions
 */
async function getAllSubmissions(req, res, next) {
    try {
        const submissions = await Submission.find()
            .populate("courseId", "title slug status")
            .populate("submittedBy", "name email")
            .sort("-submittedAt");
            
        res.json({ success: true, count: submissions.length, data: submissions });
    } catch (error) {
        next(error);
    }
}

/**
 * Get submission details
 * @route GET /api/admin/submissions/:id
 */
async function getSubmissionById(req, res, next) {
    try {
        const submission = await Submission.findById(req.params.id)
            .populate("courseId")
            .populate("submittedBy", "name email");

        if (!submission) {
            return res.status(404).json({
                success: false,
                error: { code: "SUBMISSION_NOT_FOUND", message: "Submission not found" },
            });
        }

        res.json({ success: true, data: submission });
    } catch (error) {
        next(error);
    }
}

/**
 * Approve submission
 * @route PUT /api/admin/submissions/:id/approve
 */
async function approveSubmission(req, res, next) {
    try {
        const { notes } = req.body;
        const submission = await Submission.findById(req.params.id);

        if (!submission) {
            return res.status(404).json({
                success: false,
                error: { code: "SUBMISSION_NOT_FOUND", message: "Submission not found" },
            });
        }

        // Update submission status
        submission.status = "approved";
        submission.reviewedBy = req.user.id;
        submission.reviewedAt = Date.now();
        submission.reviewNotes = notes;
        
        submission.history.push({
            status: "approved",
            reviewedBy: req.user.id,
            reviewedAt: Date.now(),
            notes: notes
        });

        await submission.save();

        // Publish the course
        await Course.findByIdAndUpdate(submission.courseId, { status: "published" });

        res.json({ success: true, message: "Submission approved and course published", data: submission });
    } catch (error) {
        next(error);
    }
}

/**
 * Reject submission
 * @route PUT /api/admin/submissions/:id/reject
 */
async function rejectSubmission(req, res, next) {
    try {
        const { rejectionReason, notes } = req.body;
        
        if (!rejectionReason) {
             return res.status(400).json({
                success: false,
                error: { code: "MISSING_REASON", message: "Rejection reason is required" },
            });
        }

        const submission = await Submission.findById(req.params.id);

        if (!submission) {
            return res.status(404).json({
                success: false,
                error: { code: "SUBMISSION_NOT_FOUND", message: "Submission not found" },
            });
        }

        submission.status = "rejected";
        submission.reviewedBy = req.user.id;
        submission.reviewedAt = Date.now();
        submission.rejectionReason = rejectionReason;
        submission.reviewNotes = notes;

        submission.history.push({
            status: "rejected",
            reviewedBy: req.user.id,
            reviewedAt: Date.now(),
            notes: `Rejected: ${rejectionReason}`
        });

        await submission.save();

        res.json({ success: true, message: "Submission rejected", data: submission });
    } catch (error) {
        next(error);
    }
}

/**
 * Request changes for submission
 * @route PUT /api/admin/submissions/:id/request-changes
 */
async function requestChanges(req, res, next) {
    try {
        const { changesRequested, notes } = req.body;
        
        if (!changesRequested) {
             return res.status(400).json({
                success: false,
                error: { code: "MISSING_CHANGES", message: "Requested changes description is required" },
            });
        }

        const submission = await Submission.findById(req.params.id);

        if (!submission) {
            return res.status(404).json({
                success: false,
                error: { code: "SUBMISSION_NOT_FOUND", message: "Submission not found" },
            });
        }

        submission.status = "changes_requested";
        submission.reviewedBy = req.user.id;
        submission.reviewedAt = Date.now();
        submission.changesRequested = changesRequested;
        submission.reviewNotes = notes;

        submission.history.push({
            status: "changes_requested",
            reviewedBy: req.user.id,
            reviewedAt: Date.now(),
            notes: `Changes Requested: ${changesRequested}`
        });

        await submission.save();

        res.json({ success: true, message: "Changes requested", data: submission });
    } catch (error) {
        next(error);
    }
}

// --- Course Management ---

/**
 * Takedown course
 * @route PUT /api/admin/courses/:id/takedown
 */
async function takedownCourse(req, res, next) {
    try {
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            { status: "draft" }, // Revert to draft or specific 'suspended' status
            { new: true }
        );

        if (!course) {
            return res.status(404).json({
                success: false,
                error: { code: "COURSE_NOT_FOUND", message: "Course not found" },
            });
        }

        res.json({ success: true, message: "Course taken down (reverted to draft)", data: course });
    } catch (error) {
        next(error);
    }
}

// --- Analytics ---

/**
 * Get platform analytics
 * @route GET /api/admin/analytics
 */
async function getAnalytics(req, res, next) {
    try {
        const totalUsers = await User.countDocuments();
        const totalCourses = await Course.countDocuments();
        const publishedCourses = await Course.countDocuments({ status: "published" });
        const pendingSubmissions = await Submission.countDocuments({ status: "submitted" });
        
        res.json({
            success: true,
            data: {
                users: { total: totalUsers },
                courses: { total: totalCourses, published: publishedCourses },
                submissions: { pending: pendingSubmissions }
            }
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    updateUserStatus,
    getAllSubmissions,
    getSubmissionById,
    approveSubmission,
    rejectSubmission,
    requestChanges,
    takedownCourse,
    getAnalytics
};
