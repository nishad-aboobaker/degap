/**
 * Standard response helpers to align with DESIGN.md 4.9.
 */

function successResponse(res, data = null, message = null, statusCode = 200) {
  const payload = {
    success: true,
  };

  if (data !== null && data !== undefined) {
    payload.data = data;
  }

  if (message) {
    payload.message = message;
  }

  return res.status(statusCode).json(payload);
}

function paginatedResponse(
  res,
  data,
  pagination,
  message = null,
  statusCode = 200
) {
  return res.status(statusCode).json({
    success: true,
    data,
    pagination,
    message: message || undefined,
  });
}

function errorResponse(res, error, statusCode = 400) {
  return res.status(statusCode).json({
    success: false,
    error,
  });
}

module.exports = {
  successResponse,
  paginatedResponse,
  errorResponse,
};
