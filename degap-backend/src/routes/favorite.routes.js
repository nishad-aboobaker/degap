const express = require("express");
const router = express.Router();
const {
    toggleFavorite,
    checkFavorite,
    getFavorites,
} = require("../controllers/favorite.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.use(authenticate);

router.post("/toggle", toggleFavorite);
router.get("/check/:courseId", checkFavorite);
router.get("/", getFavorites);

module.exports = router;
