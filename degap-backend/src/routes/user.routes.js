const express = require("express");
const router = express.Router();
const {
    getProfile,
    updateProfile,
    getUserById,
    changePassword,
    updateEmail,
    deleteAccount,
} = require("../controllers/user.controller");
const { authenticate } = require("../middleware/auth.middleware");

// Protected routes (profile must come before :id to avoid conflict)
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);
router.put("/password", authenticate, changePassword);
router.put("/email", authenticate, updateEmail);
router.delete("/account", authenticate, deleteAccount);

// Public routes
router.get("/:id", getUserById);

module.exports = router;
