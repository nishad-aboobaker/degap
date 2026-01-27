const UserProgress = require("../models/UserProgress");
const Course = require("../models/Course");
const Roadmap = require("../models/Roadmap");

/**
 * Get all progress for current user
 * @route GET /api/progress
 * @access Private
 */
async function getAllProgress(req, res, next) {
    try {
        const progress = await UserProgress.find({ userId: req.user.id })
            .populate("courseId", "title slug thumbnail")
            .sort("-lastAccessedAt");

        res.json({
            success: true,
            count: progress.length,
            data: progress,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get progress for specific course
 * @route GET /api/progress/course/:courseId
 * @access Private
 */
async function getProgressByCourse(req, res, next) {
    try {
        const progress = await UserProgress.findOne({
            userId: req.user.id,
            courseId: req.params.courseId,
        }).populate("roadmapId", "title steps");

        if (!progress) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "PROGRESS_NOT_FOUND",
                    message: "Progress not found for this course",
                },
            });
        }

        res.json({
            success: true,
            data: progress,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Start course and initialize progress
 * @route POST /api/progress/start
 * @access Private
 */
async function startCourse(req, res, next) {
    try {
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "MISSING_FIELDS",
                    message: "Please provide courseId",
                },
            });
        }

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

        let progress = await UserProgress.findOne({
            userId: req.user.id,
            courseId,
        });

        if (progress) {
            return res.json({
                success: true,
                message: "Course already started",
                data: progress,
            });
        }

        const roadmap = await Roadmap.findOne({ courseId });

        if (!roadmap) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "ROADMAP_NOT_FOUND",
                    message: "No roadmap found for this course",
                },
            });
        }

        progress = await UserProgress.create({
            userId: req.user.id,
            courseId,
            roadmapId: roadmap._id,
            completedSteps: [],
            progressPercentage: 0,
        });

        res.status(201).json({
            success: true,
            message: "Course started successfully",
            data: progress,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Update step progress (mark complete/incomplete)
 * @route PUT /api/progress/step
 * @access Private
 */
async function updateStepProgress(req, res, next) {
    try {
        const { courseId, roadmapId, stepNumber, completed } = req.body;

        if (!courseId || !roadmapId || stepNumber === undefined) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "MISSING_FIELDS",
                    message: "Please provide courseId, roadmapId, and stepNumber",
                },
            });
        }

        let progress = await UserProgress.findOne({
            userId: req.user.id,
            courseId: courseId,
        });

        // Verify roadmap exists and get total steps
        const roadmap = await Roadmap.findById(roadmapId);
        if (!roadmap) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "ROADMAP_NOT_FOUND",
                    message: "Roadmap not found",
                },
            });
        }

        if (!progress) {
            // Initialize progress if it doesn't exist
            progress = await UserProgress.create({
                userId: req.user.id,
                courseId: courseId,
                roadmapId: roadmapId,
                completedSteps: [],
                progressPercentage: 0,
            });
        }

        if (completed) {
            if (!progress.completedSteps.includes(stepNumber)) {
                progress.completedSteps.push(stepNumber);
            }
        } else {
            progress.completedSteps = progress.completedSteps.filter(
                (step) => step !== stepNumber
            );
        }

        // Calculate percentage
        const totalSteps = roadmap.steps.length;
        if (totalSteps > 0) {
            progress.progressPercentage = Math.round(
                (progress.completedSteps.length / totalSteps) * 100
            );
        } else {
            progress.progressPercentage = 100;
        }

        // Update timestamps
        progress.lastAccessedAt = Date.now();
        if (progress.progressPercentage === 100 && !progress.completedAt) {
            progress.completedAt = Date.now();
        } else if (progress.progressPercentage < 100) {
            progress.completedAt = null;
        }

        await progress.save();

        res.json({
            success: true,
            data: progress,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Reset course progress
 * @route DELETE /api/progress/course/:courseId
 * @access Private
 */
async function resetCourseProgress(req, res, next) {
    try {
        const progress = await UserProgress.findOne({
            userId: req.user.id,
            courseId: req.params.courseId,
        });

        if (!progress) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "PROGRESS_NOT_FOUND",
                    message: "Progress not found for this course",
                },
            });
        }

        await UserProgress.deleteOne({ _id: progress._id });

        res.json({
            success: true,
            message: "Course progress reset successfully",
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllProgress,
    getProgressByCourse,
    startCourse,
    updateStepProgress,
    resetCourseProgress,
};
