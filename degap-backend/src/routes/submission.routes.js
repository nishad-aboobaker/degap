const express = require("express");
const router = express.Router();
const {
    createSubmission,
    getMySubmissions,
    getSubmissionById,
    resubmitCourse,
} = require("../controllers/submission.controller");
const { authenticate } = require("../middleware/auth.middleware");

// All routes are protected
router.use(authenticate);

router.post("/", createSubmission);
router.get("/my-submissions", getMySubmissions);
router.get("/:id", getSubmissionById);
router.put("/:id", resubmitCourse);

module.exports = router;
