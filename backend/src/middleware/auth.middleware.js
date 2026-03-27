const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { HTTP_STATUS } = require("../config/constants");

const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("Not authorized, no token", HTTP_STATUS.UNAUTHORIZED),
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return next(new AppError("User not found", HTTP_STATUS.NOT_FOUND));
    }

    if (!req.user.isActive) {
      return next(
        new AppError("Account is deactivated", HTTP_STATUS.FORBIDDEN),
      );
    }

    next();
  } catch (error) {
    return next(
      new AppError("Not authorized, token failed", HTTP_STATUS.UNAUTHORIZED),
    );
  }
});

module.exports = { protect };
