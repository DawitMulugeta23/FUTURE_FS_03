const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getAllFeedback,
  replyToFeedback,
  deleteFeedback,
} = require("../controllers/feedback.controller");
import {
  countUser,
  deletUser,
  getUser,
  SendEmail,
  sendtoaUser,
  Setting,
  updateSetting,
  updateUser,
} from "../controllers/admin.Controller";
router.use((req, res, next) => {
  console.log(`[Admin Routes] ${req.method} ${req.originalUrl}`);
  next();
});

// Protect all admin routes
router.use(protect, authorize("admin"));

// User management
router.get("/users", getUser);
router.get("/users/count", countUser);
router.put("/users/:id/role", updateUser);
router.delete("/users/:id", deletUser);
router.post("/email/campaign", SendEmail);
router.post("/send-email", sendtoaUser);
router.get("/settings", Setting);
router.put("/settings", updateSetting);
router.get("/feedback", getAllFeedback);
router.post("/feedback/:id/reply", replyToFeedback);
router.delete("/feedback/:id", deleteFeedback);

module.exports = router;
