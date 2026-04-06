// backend/src/routes/authRoutes.js
const express = require("express");
const passport = require("passport");
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
  googleCallback,
  googleFailure,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerCustomer);
router.post("/register/customer", registerCustomer);
router.post("/register/staff", registerStaff);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/google/failure",
    session: false,
  }),
  googleCallback,
);

router.get("/google/failure", googleFailure);

module.exports = router;
