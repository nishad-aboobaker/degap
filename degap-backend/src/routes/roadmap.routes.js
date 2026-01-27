const express = require("express");
const router = express.Router();
const {
    getRoadmapsByCourse,
    getRoadmapById,
    createRoadmap,
    updateRoadmap,
    deleteRoadmap,
    trackProgress,
    getProgress,
} = require("../controllers/roadmap.controller");
const { authenticate } = require("../middleware/auth.middleware");

// Public routes
router.get("/course/:courseId", getRoadmapsByCourse);
router.get("/:id", getRoadmapById);

// Protected routes
router.post("/", authenticate, createRoadmap);
router.put("/:id", authenticate, updateRoadmap);
router.delete("/:id", authenticate, deleteRoadmap);

// Progress tracking
router.get("/:id/progress", authenticate, getProgress);
router.post("/:id/progress", authenticate, trackProgress);

module.exports = router;
