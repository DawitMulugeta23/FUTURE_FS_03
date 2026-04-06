// backend/src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerCustomer,
  registerStaff,
  login,
  getProfile,
  updateProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Customer routes (common registration)
router.post("/register", registerCustomer);
router.post("/register/customer", registerCustomer);
router.post("/register/staff", registerStaff);

// Login route
router.post("/login", login);

// Profile routes (ADD THESE)
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;
