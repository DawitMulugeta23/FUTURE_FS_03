// backend/src/routes/auth.routes.js
const express = require("express");
const router = express.Router();
const {
  registerCustomer,
  registerAdmin,
  registerStaff,
  login,
} = require("../controllers/authController");

// Customer routes
router.post("/register", registerCustomer);
router.post("/register/customer", registerCustomer);

// Admin routes
router.post("/register/admin", registerAdmin);

// Staff routes
router.post("/register/staff", registerStaff);

// Login route
router.post("/login", login);

module.exports = router;