const Roadmap = require("../models/Roadmap");
const Course = require("../models/Course");
const UserProgress = require("../models/UserProgress");

/**
 * Get roadmaps for a specific course
 * @route GET /api/roadmaps/course/:courseId
 * @access Public
 */
async function getRoadmapsByCourse(req, res, next) {
    try {
        const roadmaps = await Roadmap.find({ courseId: req.params.courseId });

        res.json({
            success: true,
            count: roadmaps.length,
            data: roadmaps,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get single roadmap by ID
 * @route GET /api/roadmaps/:id
 * @access Public
 */
async function getRoadmapById(req, res, next) {
    try {
        const roadmap = await Roadmap.findById(req.params.id);

        if (!roadmap) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "ROADMAP_NOT_FOUND",
                    message: "Roadmap not found",
                },
            });
        }

        res.json({
            success: true,
            data: roadmap,
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                error: {
                    code: "ROADMAP_NOT_FOUND",
                    message: "Roadmap not found",
                },
            });
        }
        next(error);
    }
}

/**
 * Create new roadmap
 * @route POST /api/roadmaps
 * @access Private (Instructor/Admin)
 */
async function createRoadmap(req, res, next) {
    try {
        const { courseId, title, description, steps } = req.body;

        // Verify course exists
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

        // Check ownership
        // console.log("Debug Roadmap Auth:", { 
        //     courseCreator: course.createdBy.toString(), 
        //     userId: req.user.id.toString(),
        //     match: course.createdBy.toString() === req.user.id.toString()
        // });
        
        if (course.createdBy.toString() !== req.user.id.toString() && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                error: {
                    code: "NOT_AUTHORIZED",
                    message: "Not authorized to create roadmap for this course",
                },
            });
        }

        const roadmap = await Roadmap.create({
            courseId,
            title,
            description,
            steps,
        });

        res.status(201).json({
            success: true,
            data: roadmap,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Update roadmap
 * @route PUT /api/roadmaps/:id
 * @access Private (Instructor/Admin)
 */
async function updateRoadmap(req, res, next) {
    try {
        let roadmap = await Roadmap.findById(req.params.id);

        if (!roadmap) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "ROADMAP_NOT_FOUND",
                    message: "Roadmap not found",
                },
            });
        }

        // Verify ownership via course
        const course = await Course.findById(roadmap.courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "COURSE_NOT_FOUND",
                    message: "Associated course not found",
                },
            });
        }

        if (course.createdBy.toString() !== req.user.id.toString() && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                error: {
                    code: "NOT_AUTHORIZED",
                    message: "Not authorized to update this roadmap",
                },
            });
        }

        roadmap = await Roadmap.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.json({
            success: true,
            data: roadmap,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Delete roadmap
 * @route DELETE /api/roadmaps/:id
 * @access Private (Instructor/Admin)
 */
async function deleteRoadmap(req, res, next) {
    try {
        const roadmap = await Roadmap.findById(req.params.id);

        if (!roadmap) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "ROADMAP_NOT_FOUND",
                    message: "Roadmap not found",
                },
            });
        }

        // Verify ownership via course
        const course = await Course.findById(roadmap.courseId);
        // If course is deleted, we might still want to delete the roadmap by admin
        if (course && course.createdBy.toString() !== req.user.id.toString() && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                error: {
                    code: "NOT_AUTHORIZED",
                    message: "Not authorized to delete this roadmap",
                },
            });
        }

        await Roadmap.deleteOne({ _id: req.params.id });

        res.json({
            success: true,
            message: "Roadmap deleted successfully",
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Track user progress (complete/uncomplete step)
 * @route POST /api/roadmaps/:id/progress
 * @access Private
 */
async function trackProgress(req, res, next) {
    try {
        const { stepNumber, completed } = req.body;
        const roadmapId = req.params.id;

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

        let progress = await UserProgress.findOne({
            userId: req.user.id,
            courseId: roadmap.courseId,
        });

        if (!progress) {
            // Initialize progress if not exists
            progress = await UserProgress.create({
                userId: req.user.id,
                courseId: roadmap.courseId,
                roadmapId: roadmap._id,
                completedSteps: [],
                progressPercentage: 0,
            });
        }

        if (completed) {
            // Add step if not already completed
            if (!progress.completedSteps.includes(stepNumber)) {
                progress.completedSteps.push(stepNumber);
            }
        } else {
            // Remove step
            progress.completedSteps = progress.completedSteps.filter(
                (step) => step !== stepNumber
            );
        }

        // Recalculate percentage
        const totalSteps = roadmap.steps.length;
        if (totalSteps > 0) {
            progress.progressPercentage = Math.round(
                (progress.completedSteps.length / totalSteps) * 100
            );
        } else {
            progress.progressPercentage = 100; // Empty roadmap?
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
 * Get user progress for a roadmap
 * @route GET /api/roadmaps/:id/progress
 * @access Private
 */
async function getProgress(req, res, next) {
    try {
        const roadmap = await Roadmap.findById(req.params.id);
        if (!roadmap) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "ROADMAP_NOT_FOUND",
                    message: "Roadmap not found",
                },
            });
        }

        const progress = await UserProgress.findOne({
            userId: req.user.id,
            courseId: roadmap.courseId,
        });

        if (!progress) {
            return res.json({
                success: true,
                data: {
                    completedSteps: [],
                    progressPercentage: 0,
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

module.exports = {
    getRoadmapsByCourse,
    getRoadmapById,
    createRoadmap,
    updateRoadmap,
    deleteRoadmap,
    trackProgress,
    getProgress,
};
