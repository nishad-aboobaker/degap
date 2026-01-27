const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const { env } = require("./config/env");
const { connectDB } = require("./config/database");
const { errorHandler, notFoundHandler } = require("./middleware/error.middleware");
const { apiLimiter } = require("./middleware/rateLimit.middleware");

async function main() {
  await connectDB(env.MONGODB_URI);

  const app = express();

  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    })
  );
  
  // Use custom rate limiter
  app.use(apiLimiter);

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "degap-backend", env: env.NODE_ENV });
  });

  // Mount routes
  const authRoutes = require("./routes/auth.routes");
  const userRoutes = require("./routes/user.routes");
  const courseRoutes = require("./routes/course.routes");
  const roadmapRoutes = require("./routes/roadmap.routes");
  const progressRoutes = require("./routes/progress.routes");
  const submissionRoutes = require("./routes/submission.routes");
  const adminRoutes = require("./routes/admin.routes");
  const favoriteRoutes = require("./routes/favorite.routes");

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/courses", courseRoutes);
  app.use("/api/roadmaps", roadmapRoutes);
  app.use("/api/progress", progressRoutes);
  app.use("/api/submissions", submissionRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/favorites", favoriteRoutes);

  // TODO: mount other routes here

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on port ${env.PORT}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Fatal startup error:", err);
  process.exit(1);
});


