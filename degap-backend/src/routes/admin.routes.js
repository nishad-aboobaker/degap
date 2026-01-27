const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/admin.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeAdmin } = require("../middleware/admin.middleware");

// Protect all admin routes
router.use(authenticate, authorizeAdmin);

// User Management
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id/status", updateUserStatus); // Currently updates role

// Submission Management
router.get("/submissions", getAllSubmissions);
router.get("/submissions/:id", getSubmissionById);
router.put("/submissions/:id/approve", approveSubmission);
router.put("/submissions/:id/reject", rejectSubmission);
router.put("/submissions/:id/request-changes", requestChanges);

// Course Management
router.put("/courses/:id/takedown", takedownCourse);

// Analytics
router.get("/analytics", getAnalytics);

module.exports = router;
