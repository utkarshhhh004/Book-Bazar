
/**
 * Handle requests to routes that do not exist.
 */
export const notFoundHandler = (req, res, next) => {
  const error = new Error(
    `Route not found: ${req.method} ${req.originalUrl}`
  );

  error.statusCode = 404;

  next(error);
};

/**
 * Centralized Express error handler.
 *
 * Must be registered after all API routes.
 */
export const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error.";
  let errors = [];

  // Mongoose duplicate-key error.
  if (error.code === 11000) {
    statusCode = 409;
    message = "A record with this information already exists.";
  }

  // Mongoose validation error.
  if (error.name === "ValidationError") {
    statusCode = 422;
    message = "Database validation failed.";

    errors = Object.values(error.errors).map((item) => ({
      field: item.path,
      message: item.message,
    }));
  }

  // Invalid MongoDB ObjectId.
  if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource identifier.";
  }

  // Invalid or expired JWT.
  if (
    error.name === "JsonWebTokenError" ||
    error.name === "TokenExpiredError"
  ) {
    statusCode = 401;
    message = "Invalid or expired authentication token.";
  }

  // Never expose unexpected internal errors in production.
  if (statusCode >= 500) {
    message =
      process.env.NODE_ENV === "production"
        ? "Internal server error."
        : message;

    console.error("Backend Error:", error);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length > 0 ? { errors } : {}),
    ...(process.env.NODE_ENV !== "production" && statusCode >= 500
      ? { stack: error.stack }
      : {}),
  });
};
