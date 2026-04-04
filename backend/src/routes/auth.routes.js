// backend/src/routes/auth.routes.js
const express = require("express");
const router = express.Router();
const {
  registerCustomer,
  registerAdmin,
  registerStaff,
  login,
} = require("../controllers/authController");
const { updateProfile, getProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// Customer routes
router.post("/register", registerCustomer);
router.post("/register/customer", registerCustomer);

// Admin routes
router.post("/register/admin", registerAdmin);

// Staff routes
router.post("/register/staff", registerStaff);

// Login route
router.post("/login", login);

// Profile routes (protected)
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;
