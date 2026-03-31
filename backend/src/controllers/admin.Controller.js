const { protect, authorize } = require("../middleware/authMiddleware");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

export const getUser = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const countUser = async (req, res) => {
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
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
export const SingleUser = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
export const deletUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (user.role === "admin") {
      return res
        .status(403)
        .json({ success: false, error: "Cannot delete admin users" });
    }

    await user.deleteOne();
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
export const SendEmail = async (req, res) => {
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
      }).catch((err) => console.error(`Failed to send to ${user.email}:`, err)),
    );

    await Promise.all(emailPromises);

    res.json({ success: true, count: users.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
export const sendtoaUser = async (req, res) => {
  try {
    const { userId, subject, message } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    await sendEmail({
      email: user.email,
      subject,
      message: `Hello ${user.name},\n\n${message}\n\nBest regards,\nYesekela Café Team`,
    });

    res.json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
export const Setting = async (req, res) => {
  try {
    const settings = {
      cafeName: "Yesekela Café",
      email: "info@yesekelacafe.com",
      phone: "+251-911-123456",
      address: "Main Road, Near DBU Entrance",
      city: "Debre Berhan",
      openingHours: "7:00 AM - 9:00 PM",
      deliveryFee: 0,
      minimumOrder: 0,
      taxRate: 0,
    };
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
export const updateSetting = async (req, res) => {
  try {
    res.json({ success: true, message: "Settings updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
