const mongoose = require("mongoose");
const { logger } = require("../utils/logger");

/**
 * Seed script to create initial database structure
 * Run this script once to set up the database
 */
async function seedDatabase() {
    try {
        const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/degap";

        await mongoose.connect(mongoUri);
        logger.info("Connected to MongoDB for seeding");

        // Create collections (they will be created automatically when models are used)
        // For now, just verify connection
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();

        logger.info(`Current collections: ${collections.map(c => c.name).join(", ") || "none"}`);
        logger.info("Database is ready for use");

        await mongoose.connection.close();
        logger.info("Seed completed successfully");
    } catch (error) {
        logger.error("Seed failed:", error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    require("dotenv").config();
    seedDatabase();
}

module.exports = { seedDatabase };
