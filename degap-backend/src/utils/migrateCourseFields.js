const mongoose = require("mongoose");
const Course = require("../models/Course");
const { logger } = require("./logger");

/**
 * One-off helper to migrate existing Course documents to the latest schema.
 *
 * Safe to run multiple times; operations are idempotent.
 *
 * - Copies `technologies` -> `technologyStack` when the new field is empty.
 * - Ensures `status` is one of the extended enum values (no-op if already valid).
 * - Initializes `coOwners` and `tags` as empty arrays when missing.
 *
 * Usage (example):
 *   NODE_ENV=development node -e "require('./src/utils/migrateCourseFields').migrateCourses(process.env.MONGODB_URI)"
 */
async function migrateCourses(mongoUri) {
  try {
    if (mongoUri) {
      await mongoose.connect(mongoUri);
    }

    const courses = await Course.find({});

    for (const course of courses) {
      let dirty = false;

      // Backfill technologyStack from legacy technologies field
      if (
        Array.isArray(course.technologies) &&
        course.technologies.length > 0 &&
        (!Array.isArray(course.technologyStack) ||
          course.technologyStack.length === 0)
      ) {
        course.technologyStack = course.technologies;
        dirty = true;
      }

      // Normalize tags to an array
      if (!Array.isArray(course.tags)) {
        course.tags = [];
        dirty = true;
      }

      // Ensure coOwners is an array
      if (!Array.isArray(course.coOwners)) {
        course.coOwners = [];
        dirty = true;
      }

      if (dirty) {
        await course.save();
      }
    }

    logger.info(`Course migration complete. Processed ${courses.length} courses.`);

    if (mongoUri) {
      await mongoose.connection.close();
    }
  } catch (error) {
    logger.error("Course migration failed:", error);
    if (mongoUri) {
      await mongoose.connection.close();
    }
    throw error;
  }
}

module.exports = {
  migrateCourses,
};

