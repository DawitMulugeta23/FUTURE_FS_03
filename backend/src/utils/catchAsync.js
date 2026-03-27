const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      if (typeof next === "function") {
        next(err);
      } else if (res && typeof res.status === "function" && !res.headersSent) {
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    });
  };
};

module.exports = catchAsync;
