const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validation.middleware");
const {
  registerSchema,
  loginSchema,
  updateProfileSchema,
} = require("../validations/auth.validation");
const { authLimiter } = require("../middleware/rateLimiter.middleware");

router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  authController.register,
);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.get("/me", protect, authController.getMe);
router.put(
  "/profile",
  protect,
  validate(updateProfileSchema),
  authController.updateProfile,
);

module.exports = router;
