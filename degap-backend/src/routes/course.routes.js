const express = require("express");
const router = express.Router();
const {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getMyCourses,
    toggleFavorite,
    getMyFavorites,
} = require("../controllers/course.controller");
const { authenticate } = require("../middleware/auth.middleware");

// 1. Specific non-param routes (Protected or Public)
router.get("/my-courses", authenticate, getMyCourses);
router.get("/my-favorites", authenticate, getMyFavorites);

// 2. Collection routes
router.get("/", getCourses);
router.post("/", authenticate, createCourse);

// 3. Param routes (Order matters less here usually, but should be last)
router.get("/:id", getCourseById);
router.put("/:id", authenticate, updateCourse);
router.delete("/:id", authenticate, deleteCourse);
router.post("/:id/favorite", authenticate, toggleFavorite);

module.exports = router;
