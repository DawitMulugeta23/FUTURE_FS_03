const Feedback = require("../models/Feedback");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// @desc    Submit feedback
// @route   POST /api/feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { rating, title, message } = req.body;

    if (!rating || !title || !message) {
      return res.status(400).json({
        success: false,
        error: "Please provide rating, title, and message",
      });
    }

    const feedback = await Feedback.create({
      user: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      rating,
      title,
      message,
    });

    // Send confirmation email to user
    try {
      await sendEmail({
        email: req.user.email,
        subject: "Thank You for Your Feedback - Yesekela Café",
        message: `
Hello ${req.user.name},

Thank you for taking the time to share your feedback with us!

Your Feedback:
Rating: ${rating} ★
Title: ${title}
Message: ${message}

We value your opinion and will use it to improve our service.

Best regards,
Yesekela Café Team
        `,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the request if email fails
    }

    // Notify admin about new feedback
    try {
      const admins = await User.find({ role: "admin" }).select("email");
      for (const admin of admins) {
        await sendEmail({
          email: admin.email,
          subject: "New Feedback Received - Yesekela Café",
          message: `
Hello Admin,

New feedback has been submitted by ${req.user.name} (${req.user.email}):

Rating: ${rating} ★
Title: ${title}
Message: ${message}

Please review and respond if necessary.

Best regards,
Yesekela Café System
          `,
        });
      }
    } catch (emailError) {
      console.error("Admin notification failed:", emailError);
    }

    res.status(201).json({
      success: true,
      data: feedback,
      message: "Feedback submitted successfully!",
    });
  } catch (err) {
    console.error("Submit feedback error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get user's own feedback
// @route   GET /api/feedback/myfeedback
exports.getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ user: req.user.id }).sort(
      "-createdAt",
    );
    res.status(200).json({ success: true, data: feedback });
  } catch (err) {
    console.error("Get my feedback error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get all feedback (Admin)
// @route   GET /api/admin/feedback
exports.getAllFeedback = async (req, res) => {
  try {
    const { status, rating, search } = req.query;
    let filter = {};

    if (status && status !== "all") filter.status = status;
    if (rating) filter.rating = parseInt(rating);
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
        { userName: { $regex: search, $options: "i" } },
      ];
    }

    const feedback = await Feedback.find(filter).sort("-createdAt");

    // Get statistics
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalFeedback: { $sum: 1 },
          pendingCount: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          repliedCount: {
            $sum: { $cond: [{ $eq: ["$status", "replied"] }, 1, 0] },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: feedback.length,
      stats: stats[0] || {
        averageRating: 0,
        totalFeedback: 0,
        pendingCount: 0,
        repliedCount: 0,
      },
      data: feedback,
    });
  } catch (err) {
    console.error("Get all feedback error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Reply to feedback (Admin)
// @route   POST /api/admin/feedback/:id/reply
exports.replyToFeedback = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Please provide a reply message",
      });
    }

    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res
        .status(404)
        .json({ success: false, error: "Feedback not found" });
    }

    // Update feedback with admin reply
    feedback.status = "replied";
    feedback.adminReply = {
      message,
      repliedAt: Date.now(),
      repliedBy: req.user.id,
    };
    await feedback.save();

    // Send email reply to user
    try {
      await sendEmail({
        email: feedback.userEmail,
        subject: `Response to Your Feedback - Yesekela Café`,
        message: `
Hello ${feedback.userName},

Thank you for your feedback. Here's our response:

Your Feedback: "${feedback.title}"
Our Response: ${message}

We appreciate your input and hope to serve you better!

Best regards,
Yesekela Café Team
        `,
      });
    } catch (emailError) {
      console.error("Reply email failed:", emailError);
    }

    res.status(200).json({
      success: true,
      data: feedback,
      message: "Reply sent successfully!",
    });
  } catch (err) {
    console.error("Reply to feedback error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Delete feedback (Admin)
// @route   DELETE /api/admin/feedback/:id
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res
        .status(404)
        .json({ success: false, error: "Feedback not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Feedback deleted successfully" });
  } catch (err) {
    console.error("Delete feedback error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
