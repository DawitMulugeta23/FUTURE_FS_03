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

// Admin routes (protected by admin code)
router.post("/register/admin", registerAdmin);

// Staff routes (protected by manager code)
router.post("/register/staff", registerStaff);

// Login route (common)
router.post("/login", login);

module.exports = router;
