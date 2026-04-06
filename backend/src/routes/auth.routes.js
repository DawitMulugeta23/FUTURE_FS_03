// backend/src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerCustomer,
  registerStaff,
  login,
} = require("../controllers/authController");

// Customer routes (common registration)
router.post("/register", registerCustomer);
router.post("/register/customer", registerCustomer);

router.post("/register/staff", registerStaff);

// Login route
router.post("/login", login);

module.exports = router;
