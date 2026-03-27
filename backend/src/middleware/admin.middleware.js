const AppError = require("../utils/AppError");
const { HTTP_STATUS } = require("../config/constants");

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    next(new AppError("Not authorized as admin", HTTP_STATUS.FORBIDDEN));
  }
};

module.exports = { admin };
