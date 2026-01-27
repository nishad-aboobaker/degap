const express = require("express");
const router = express.Router();
const {
    getAllProgress,
    getProgressByCourse,
    startCourse,
    updateStepProgress,
    resetCourseProgress,
} = require("../controllers/progress.controller");
const { authenticate } = require("../middleware/auth.middleware");

// All routes are protected
router.use(authenticate);

router.get("/", getAllProgress);
router.post("/start", startCourse);
router.get("/course/:courseId", getProgressByCourse);
router.put("/step", updateStepProgress);
router.delete("/course/:courseId", resetCourseProgress);

module.exports = router;
