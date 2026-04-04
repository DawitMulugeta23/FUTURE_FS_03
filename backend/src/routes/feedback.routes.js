// backend/src/routes/feedback.routes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  submitFeedback,
  getMyFeedback,
} = require("../controllers/feedback.controller");

// Debug middleware
router.use((req, res, next) => {
  console.log(`[Feedback Routes] ${req.method} ${req.originalUrl}`);
  next();
});

// All routes require authentication
router.use(protect);

router.post("/", submitFeedback);
router.get("/myfeedback", getMyFeedback);

module.exports = router;
