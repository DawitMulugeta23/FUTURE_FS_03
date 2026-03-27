const { HTTP_STATUS, MESSAGES } = require("../config/constants");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(`❌ Error: ${err.message}`);

  if (err.name === "CastError") {
    error.message = "Resource not found";
    error.statusCode = HTTP_STATUS.NOT_FOUND;
  }

  if (err.code === 11000) {
    error.message = "Duplicate field value entered";
    error.statusCode = HTTP_STATUS.CONFLICT;
  }

  if (err.name === "ValidationError") {
    error.message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error.statusCode = HTTP_STATUS.BAD_REQUEST;
  }

  if (err.name === "JsonWebTokenError") {
    error.message = "Invalid token";
    error.statusCode = HTTP_STATUS.UNAUTHORIZED;
  }

  if (err.name === "TokenExpiredError") {
    error.message = "Token expired";
    error.statusCode = HTTP_STATUS.UNAUTHORIZED;
  }

  const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = error.message || MESSAGES.SERVER_ERROR;

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = errorHandler;
