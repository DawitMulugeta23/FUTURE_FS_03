const rateLimit = require("express-rate-limit");

const isProduction = process.env.NODE_ENV === "production";

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: isProduction
    ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100
    : parseInt(process.env.RATE_LIMIT_DEV_MAX, 10) || 10_000,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 5 : 100,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: "Too many login attempts, please try again after 15 minutes.",
  },
});

module.exports = { limiter, authLimiter };
