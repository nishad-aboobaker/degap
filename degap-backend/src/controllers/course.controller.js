const Course = require("../models/Course");
const User = require("../models/User");
const Favorite = require("../models/Favorite");
const Roadmap = require("../models/Roadmap");
const { paginatedResponse, successResponse, errorResponse } = require("../utils/response");
const { getPaginationParams, buildPaginationMeta } = require("../utils/pagination");

/**
 * Get all courses with pagination, filtering, and sorting
 * @route GET /api/courses
 * @access Public
 */
async function getCourses(req, res, next) {
    try {
        const {
            search,
            category,
            difficulty,
            technology,
            sort = "-createdAt",
        } = req.query;

        // Build query
        const query = {}; // { status: "approved" }; // Temporarily allow all courses for dev

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
            // Support both legacy `technologies` and canonical `technologyStack`
            query.$or = [
                { technologies: { $in: [technology] } },
                { technologyStack: { $in: [technology] } },
            ];
        }

        // Pagination
        const { page, limit, skip } = getPaginationParams(req.query, {
            defaultPage: 1,
            defaultLimit: 10,
        });

        // Execute query
        const courses = await Course.find(query)
            .populate("createdBy", "name profilePicture")
            .sort(sort)
            .skip(skip)
            .limit(limit);

        // Get total count for pagination info
        const total = await Course.countDocuments(query);

        return paginatedResponse(
            res,
            courses,
            buildPaginationMeta({ page, limit, total })
        );
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
            return errorResponse(
                res,
                {
                    code: "COURSE_NOT_FOUND",
                    message: "Course not found",
                },
                404
            );
        }

        // Increment view count
        course.viewCount += 1;
        await course.save({ validateBeforeSave: false });

        return successResponse(res, course);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return errorResponse(
                res,
                {
                    code: "COURSE_NOT_FOUND",
                    message: "Course not found",
                },
                404
            );
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
            status: "approved", // Default to approved for easier testing
        });

        return successResponse(res, course, null, 201);
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
            return errorResponse(
                res,
                {
                    code: "COURSE_NOT_FOUND",
                    message: "Course not found",
                },
                404
            );
        }

        // Check ownership (or admin role)
        if (course.createdBy.toString() !== req.user.id.toString() && req.user.role !== "admin") {
            return errorResponse(
                res,
                {
                    code: "NOT_AUTHORIZED",
                    message: "Not authorized to update this course",
                },
                403
            );
        }

        course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        return successResponse(res, course);
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
            return errorResponse(
                res,
                {
                    code: "COURSE_NOT_FOUND",
                    message: "Course not found",
                },
                404
            );
        }

        // Check ownership (or admin role)
        if (course.createdBy.toString() !== req.user.id.toString() && req.user.role !== "admin") {
            return errorResponse(
                res,
                {
                    code: "NOT_AUTHORIZED",
                    message: "Not authorized to delete this course",
                },
                403
            );
        }

        // First remove any roadmaps linked to this course so we don't leave orphans.
        await Roadmap.deleteMany({ courseId: course._id });

        // Then remove the course itself using document-level deleteOne so any
        // delete middleware still runs (Mongoose 7+).
        await course.deleteOne();

        return successResponse(res, null, "Course deleted successfully");
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

        return successResponse(res, courses);
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
            return errorResponse(
                res,
                {
                    code: "COURSE_NOT_FOUND",
                    message: "Course not found",
                },
                404
            );
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

            return successResponse(
                res,
                { isFavorite: false, favoriteCount: course.favoriteCount },
                "Course removed from favorites"
            );
        } else {
            // Favorite
            await Favorite.create({
                userId: req.user.id,
                courseId: req.params.id,
            });
            course.favoriteCount += 1;
            await course.save({ validateBeforeSave: false });

            return successResponse(
                res,
                { isFavorite: true, favoriteCount: course.favoriteCount },
                "Course added to favorites"
            );
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

        return successResponse(res, courses);
    } catch (error) {
        next(error);
    }
}

/**
 * Add a co-owner to a course
 * @route POST /api/courses/:id/co-owner
 * @access Private (Owner/Admin)
 */
async function addCoOwner(req, res, next) {
    try {
        const { userId } = req.body;

        const course = await Course.findById(req.params.id);
        if (!course) {
            return errorResponse(
                res,
                {
                    code: "COURSE_NOT_FOUND",
                    message: "Course not found",
                },
                404
            );
        }

        // Only owner or admin can manage co-owners
        const isOwner = course.createdBy.toString() === req.user.id.toString();
        const isAdmin = req.user.role === "admin";
        if (!isOwner && !isAdmin) {
            return errorResponse(
                res,
                {
                    code: "NOT_AUTHORIZED",
                    message: "Not authorized to manage co-owners for this course",
                },
                403
            );
        }

        // Ensure user exists
        const coOwnerUser = await User.findById(userId);
        if (!coOwnerUser) {
            return errorResponse(
                res,
                {
                    code: "USER_NOT_FOUND",
                    message: "Co-owner user not found",
                },
                404
            );
        }

        // Prevent duplicates
        const exists = Array.isArray(course.coOwners)
            ? course.coOwners.some((entry) => entry.userId.toString() === userId.toString())
            : false;

        if (!exists) {
            course.coOwners.push({
                userId,
                addedAt: new Date(),
                addedBy: req.user.id,
            });
            await course.save();
        }

        return successResponse(res, course, "Co-owner added successfully");
    } catch (error) {
        next(error);
    }
}

/**
 * Remove a co-owner from a course
 * @route DELETE /api/courses/:id/co-owner/:userId
 * @access Private (Owner/Admin)
 */
async function removeCoOwner(req, res, next) {
    try {
        const { userId } = req.params;

        const course = await Course.findById(req.params.id);
        if (!course) {
            return errorResponse(
                res,
                {
                    code: "COURSE_NOT_FOUND",
                    message: "Course not found",
                },
                404
            );
        }

        const isOwner = course.createdBy.toString() === req.user.id.toString();
        const isAdmin = req.user.role === "admin";
        if (!isOwner && !isAdmin) {
            return errorResponse(
                res,
                {
                    code: "NOT_AUTHORIZED",
                    message: "Not authorized to manage co-owners for this course",
                },
                403
            );
        }

        course.coOwners = (course.coOwners || []).filter(
            (entry) => entry.userId.toString() !== userId.toString()
        );
        await course.save();

        return successResponse(res, course, "Co-owner removed successfully");
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
    addCoOwner,
    removeCoOwner,
};
