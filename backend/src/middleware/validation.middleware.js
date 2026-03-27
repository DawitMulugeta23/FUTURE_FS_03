const { HTTP_STATUS } = require("../config/constants");
const AppError = require("../utils/AppError");

const validate = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        return next(new AppError(errors[0].message, HTTP_STATUS.BAD_REQUEST));
      }

      req.body = result.data.body || req.body;
      req.query = result.data.query || req.query;
      req.params = result.data.params || req.params;
      next();
    } catch (error) {
      next(new AppError("Validation error", HTTP_STATUS.BAD_REQUEST));
    }
  };
};

module.exports = { validate };
