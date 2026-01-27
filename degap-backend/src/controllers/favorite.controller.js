const Favorite = require("../models/Favorite");
const Course = require("../models/Course");

/**
 * Toggle favorite status for a course
 * @route POST /api/favorites/toggle
 * @access Private
 */
async function toggleFavorite(req, res, next) {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                error: { code: "MISSING_FIELDS", message: "Course ID is required" },
            });
        }

        const existingFavorite = await Favorite.findOne({ userId, courseId });

        if (existingFavorite) {
            await Favorite.deleteOne({ _id: existingFavorite._id });
            await Course.findByIdAndUpdate(courseId, { $inc: { favoriteCount: -1 } });
            
            return res.json({
                success: true,
                isFavorite: false,
                message: "Removed from favorites",
            });
        } else {
            await Favorite.create({ userId, courseId });
            await Course.findByIdAndUpdate(courseId, { $inc: { favoriteCount: 1 } });

            return res.json({
                success: true,
                isFavorite: true,
                message: "Added to favorites",
            });
        }
    } catch (error) {
        next(error);
    }
}

/**
 * Check if a course is favorited by current user
 * @route GET /api/favorites/check/:courseId
 * @access Private
 */
async function checkFavorite(req, res, next) {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        const favorite = await Favorite.exists({ userId, courseId });

        res.json({
            success: true,
            isFavorite: !!favorite,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get all favorites for current user
 * @route GET /api/favorites
 * @access Private
 */
async function getFavorites(req, res, next) {
    try {
        const favorites = await Favorite.find({ userId: req.user.id })
            .populate({
                path: "courseId",
                select: "title slug thumbnail category difficulty favoriteCount",
            })
            .sort("-createdAt");

        res.json({
            success: true,
            count: favorites.length,
            data: favorites,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    toggleFavorite,
    checkFavorite,
    getFavorites,
};
