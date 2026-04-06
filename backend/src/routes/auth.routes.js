// backend/src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerCustomer,
  registerStaff,
  login,
  getProfile,
  updateProfile,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Customer routes (common registration)
router.post("/register", registerCustomer);
router.post("/register/customer", registerCustomer);
router.post("/register/staff", registerStaff);

// Login route
router.post("/login", login);

// Profile routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Password reset routes with 6-digit code
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);

module.exports = router;