/**
 * Middleware to check if user is admin
 * Must be placed AFTER authenticate middleware
 */
const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            error: {
                code: "FORBIDDEN",
                message: "Access denied. Admin privileges required.",
            },
        });
    }
};

module.exports = { authorizeAdmin };
