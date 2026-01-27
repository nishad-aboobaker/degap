function notFoundHandler(req, res, _next) {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: `Route not found: ${req.method} ${req.originalUrl}` },
  });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  const status = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    error: {
      code: err.code || "INTERNAL_ERROR",
      message,
      details: err.details,
    },
  });
}

module.exports = { errorHandler, notFoundHandler };


