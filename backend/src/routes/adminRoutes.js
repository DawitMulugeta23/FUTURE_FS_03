const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// Get all users
router.get("/users", protect, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user count
router.get("/users/count", protect, authorize("admin"), async (req, res) => {
  try {
    const { filter } = req.query;
    let query = {};

    if (filter === "customers") query.role = "user";
    if (filter === "active") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      query.createdAt = { $gte: thirtyDaysAgo };
    }

    const count = await User.countDocuments(query);
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send email campaign
router.post(
  "/email/campaign",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const { subject, message, userFilter } = req.body;
      let query = {};

      if (userFilter === "customers") query.role = "user";
      if (userFilter === "active") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        query.createdAt = { $gte: thirtyDaysAgo };
      }

      const users = await User.find(query);

      // Send emails asynchronously
      const emailPromises = users.map((user) =>
        sendEmail({
          email: user.email,
          subject,
          message: `Hello ${user.name},\n\n${message}\n\nBest regards,\nYesekela Café Team`,
        }).catch((err) =>
          console.error(`Failed to send to ${user.email}:`, err),
        ),
      );

      await Promise.all(emailPromises);

      res.json({ success: true, count: users.length });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// Get settings
router.get("/settings", protect, authorize("admin"), async (req, res) => {
  // You can implement settings in a separate Settings model
  res.json({ settings: {} });
});

// Update settings
router.put("/settings", protect, authorize("admin"), async (req, res) => {
  // Implement settings update
  res.json({ success: true });
});

module.exports = router;
