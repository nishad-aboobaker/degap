const Course = require("../models/Course");
const User = require("../models/User");
const Favorite = require("../models/Favorite");

/**
 * Get all courses with pagination, filtering, and sorting
 * @route GET /api/courses
 * @access Public
 */
async function getCourses(req, res, next) {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            category,
            difficulty,
            technology,
            sort = "-createdAt",
        } = req.query;

        // Build query
        const query = { status: "approved" }; // Only show approved courses publicly

        // Search text (requires text index on title and description)
        if (search) {
            query.$text = { $search: search };
        }

        if (category) {
            query.category = category;
        }

        if (difficulty) {
            query.difficulty = difficulty;
        }

        if (technology) {
            query.technologies = { $in: [technology] };
        }

        // Pagination
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        // Execute query
        const courses = await Course.find(query)
            .populate("createdBy", "name profilePicture")
            .sort(sort)
            .skip(skip)
            .limit(limitNum);

        // Get total count for pagination info
        const total = await Course.countDocuments(query);

        res.json({
            success: true,
            count: courses.length,
            total,
            pagination: {
                current: pageNum,
                pages: Math.ceil(total / limitNum),
            },
            data: courses,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get single course by ID
 * @route GET /api/courses/:id
 * @access Public
 */
async function getCourseById(req, res, next) {
    try {
        const course = await Course.findById(req.params.id)
            .populate("createdBy", "name profilePicture bio")
            .populate("roadmaps"); // Using virtual populate

        if (!course) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "COURSE_NOT_FOUND",
                    message: "Course not found",
                },
            });
        }

        // Increment view count
        course.viewCount += 1;
        await course.save({ validateBeforeSave: false });

        res.json({
            success: true,
            data: course,
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                error: {
                    code: "COURSE_NOT_FOUND",
                    message: "Course not found",
                },
            });
        }
        next(error);
    }
}

/**
 * Create new course
 * @route POST /api/courses
 * @access Private
 */
async function createCourse(req, res, next) {
    try {
        const {
            title,
            description,
            category,
            technologies,
            difficulty,
            prerequisites,
            thumbnail,
            estimatedDuration,
        } = req.body;

        // Debug logging
        console.log("Creating course with user:", req.user?.id);
        console.log("Course data:", { title, category, difficulty });

        const course = await Course.create({
            title,
            description,
            category,
            technologies,
            difficulty,
            prerequisites,
            thumbnail,
            estimatedDuration,
            createdBy: req.user.id,
            status: "draft",
        });

        res.status(201).json({
            success: true,
            data: course,
        });
    } catch (error) {
        console.error("Create Course Error:", error);
        next(error);
    }
}

/**
 * Update course
 * @route PUT /api/courses/:id
 * @access Private
 */
async function updateCourse(req, res, next) {
    try {
        let course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "COURSE_NOT_FOUND",
                    message: "Course not found",
                },
            });
        }

        // Check ownership (or admin role)
        if (course.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                error: {
                    code: "NOT_AUTHORIZED",
                    message: "Not authorized to update this course",
                },
            });
        }

        course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.json({
            success: true,
            data: course,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Delete course
 * @route DELETE /api/courses/:id
 * @access Private
 */
async function deleteCourse(req, res, next) {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "COURSE_NOT_FOUND",
                    message: "Course not found",
                },
            });
        }

        // Check ownership (or admin role)
        if (course.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                error: {
                    code: "NOT_AUTHORIZED",
                    message: "Not authorized to delete this course",
                },
            });
        }

        await course.remove(); // This triggers middleware if defined (e.g. cascading delete)
        // Note: mongoose 7+ might use deleteOne, but remove() is often preferred for hooks. 
        // If no hooks, findByIdAndDelete is faster. Let's use deleteOne for safety with recent Mongoose.
        // Wait, "remove" is deprecated in Mongoose 7. Use deleteOne.
        await Course.deleteOne({ _id: req.params.id });

        res.json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get courses created by current user
 * @route GET /api/courses/my-courses
 * @access Private
 */
async function getMyCourses(req, res, next) {
    try {
        const courses = await Course.find({ createdBy: req.user.id })
            .sort("-createdAt");

        res.json({
            success: true,
            count: courses.length,
            data: courses,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Toggle favorite status
 * @route POST /api/courses/:id/favorite
 * @access Private
 */
async function toggleFavorite(req, res, next) {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "COURSE_NOT_FOUND",
                    message: "Course not found",
                },
            });
        }

        const favorite = await Favorite.findOne({
            userId: req.user.id,
            courseId: req.params.id,
        });

        if (favorite) {
            // Unfavorite
            await Favorite.deleteOne({ _id: favorite._id });
            course.favoriteCount = Math.max(0, course.favoriteCount - 1);
            await course.save({ validateBeforeSave: false });

            res.json({
                success: true,
                message: "Course removed from favorites",
                data: { isFavorite: false, favoriteCount: course.favoriteCount },
            });
        } else {
            // Favorite
            await Favorite.create({
                userId: req.user.id,
                courseId: req.params.id,
            });
            course.favoriteCount += 1;
            await course.save({ validateBeforeSave: false });

            res.json({
                success: true,
                message: "Course added to favorites",
                data: { isFavorite: true, favoriteCount: course.favoriteCount },
            });
        }
    } catch (error) {
        next(error);
    }
}

/**
 * Get user's favorite courses
 * @route GET /api/courses/my-favorites
 * @access Private
 */
async function getMyFavorites(req, res, next) {
    try {
        const favorites = await Favorite.find({ userId: req.user.id })
            .populate({
                path: "courseId",
                select: "title description thumbnail category difficulty favoriteCount viewCount createdBy",
                populate: {
                    path: "createdBy",
                    select: "name profilePicture",
                },
            })
            .sort("-createdAt");

        // Extract courses from favorites
        const courses = favorites
            .map((fav) => fav.courseId)
            .filter((course) => course !== null); // Filter out any deleted courses

        res.json({
            success: true,
            count: courses.length,
            data: courses,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getMyCourses,
    toggleFavorite,
    getMyFavorites,
};
