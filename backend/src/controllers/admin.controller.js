// controllers/admin.controller.js

const User = require("../models/User.model");
const Order = require("../models/Order.model");
const Menu = require("../models/Menu.model");
const Reservation = require("../models/Reservation.model");
const Review = require("../models/Review.model");
const Service = require("../models/Service.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { sendEmail } = require("../utils/email.service");
const { HTTP_STATUS } = require("../config/constants");

// ==================== DASHBOARD STATS ====================

exports.getDashboardStats = catchAsync(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    totalOrders,
    totalRevenue,
    totalMenuItems,
    totalServices,
    pendingReservations,
    pendingReviews,
    todayOrders,
    todayRevenue,
  ] = await Promise.all([
    User.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
    Menu.countDocuments(),
    Service.countDocuments(),
    Reservation.countDocuments({ status: "pending" }),
    Review.countDocuments({ isApproved: false }),
    Order.countDocuments({ createdAt: { $gte: today } }),
    Order.aggregate([
      { $match: { createdAt: { $gte: today }, status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
  ]);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalMenuItems,
      totalServices,
      pendingReservations,
      pendingReviews,
      todayOrders,
      todayRevenue: todayRevenue[0]?.total || 0,
    },
  });
});

// ==================== SALES ANALYTICS ====================

exports.getSalesAnalytics = catchAsync(async (req, res, next) => {
  const { days = 7 } = req.query;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const sales = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: { $ne: "cancelled" },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        total: { $sum: "$totalAmount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: sales,
  });
});

// ==================== CUSTOMER ANALYTICS ====================

exports.getCustomerAnalytics = catchAsync(async (req, res, next) => {
  const topCustomers = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    {
      $group: {
        _id: "$user",
        totalSpent: { $sum: "$totalAmount" },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { totalSpent: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        "user.name": 1,
        "user.email": 1,
        totalSpent: 1,
        orderCount: 1,
      },
    },
  ]);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: topCustomers,
  });
});

// ==================== USER MANAGEMENT ====================

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const { role, isActive, search } = req.query;
  const filter = {};

  if (role && role !== "all") filter.role = role;
  if (isActive === "true" || isActive === "false") {
    filter.isActive = isActive === "true";
  }
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const users = await User.find(filter)
    .select("-password")
    .sort({ createdAt: -1 });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// Get user by email for admin to preview before sending
exports.getUserByEmail = catchAsync(async (req, res, next) => {
  const { email } = req.params;

  if (!email) {
    return next(new AppError("Email is required", HTTP_STATUS.BAD_REQUEST));
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "name email role isActive createdAt",
  );

  if (!user) {
    return next(new AppError("User not found", HTTP_STATUS.NOT_FOUND));
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: user,
  });
});

exports.updateUserRole = catchAsync(async (req, res, next) => {
  const { role } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true },
  ).select("-password");

  if (!user) {
    return next(new AppError("User not found", HTTP_STATUS.NOT_FOUND));
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "User role updated",
    data: user,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError("User not found", HTTP_STATUS.NOT_FOUND));
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "User deleted successfully",
  });
});

// ==================== EMAIL COMMUNICATION ====================

exports.sendEmailToUsers = catchAsync(async (req, res, next) => {
  const { userIds = [], role, isActive, search, subject, message } = req.body;

  if (!subject?.trim() || !message?.trim()) {
    return next(
      new AppError("Subject and message are required", HTTP_STATUS.BAD_REQUEST),
    );
  }

  const filter = {};

  if (Array.isArray(userIds) && userIds.length > 0) {
    filter._id = { $in: userIds };
  }
  if (role && role !== "all") filter.role = role;
  if (typeof isActive === "boolean") filter.isActive = isActive;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const users = await User.find(filter).select("name email role isActive");

  if (!users.length) {
    return next(
      new AppError(
        "No users found for the selected filters",
        HTTP_STATUS.NOT_FOUND,
      ),
    );
  }

  const htmlMessage = message.trim().replace(/\n/g, "<br />");

  const results = await Promise.allSettled(
    users.map((user) =>
      sendEmail({
        email: user.email,
        subject: subject.trim(),
        message: `Hi ${user.name},\n\n${message.trim()}\n\nBest regards,\nYesekela Cafe Team`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
            <h2 style="color: #6f4e37;">Message from Yesekela Cafe</h2>
            <p>Hi ${user.name},</p>
            <p>${htmlMessage}</p>
            <p>Best regards,<br />Yesekela Cafe Team</p>
          </div>
        `,
      }),
    ),
  );

  const successCount = results.filter(
    (result) => result.status === "fulfilled",
  ).length;
  const failedCount = results.length - successCount;

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: `Email sent to ${successCount} user${successCount === 1 ? "" : "s"}${failedCount ? ` (${failedCount} failed)` : ""}`,
    data: {
      totalRecipients: users.length,
      successCount,
      failedCount,
    },
  });
});

// Send message to users by email search
exports.sendMessageByEmail = catchAsync(async (req, res, next) => {
  const { email, subject, message, sendToAll } = req.body;

  if (!subject?.trim() || !message?.trim()) {
    return next(
      new AppError("Subject and message are required", HTTP_STATUS.BAD_REQUEST),
    );
  }

  let users = [];

  if (sendToAll) {
    // Send to all active users
    users = await User.find({ isActive: true }).select("name email role");
  } else if (email) {
    // Send to specific user by email
    const user = await User.findOne({
      email: email.toLowerCase(),
      isActive: true,
    }).select("name email role");
    if (!user) {
      return next(
        new AppError("User not found with this email", HTTP_STATUS.NOT_FOUND),
      );
    }
    users = [user];
  } else {
    return next(
      new AppError(
        "Email or sendToAll flag is required",
        HTTP_STATUS.BAD_REQUEST,
      ),
    );
  }

  if (users.length === 0) {
    return next(
      new AppError("No users found to send message", HTTP_STATUS.NOT_FOUND),
    );
  }

  const htmlMessage = message.trim().replace(/\n/g, "<br />");

  const results = await Promise.allSettled(
    users.map((user) =>
      sendEmail({
        email: user.email,
        subject: subject.trim(),
        message: `Hi ${user.name},\n\n${message.trim()}\n\nBest regards,\nYesekela Cafe Team`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
            <h2 style="color: #6f4e37;">Message from Yesekela Cafe</h2>
            <p>Hi ${user.name},</p>
            <p>${htmlMessage}</p>
            <p>Best regards,<br />Yesekela Cafe Team</p>
          </div>
        `,
      }),
    ),
  );

  const successCount = results.filter(
    (result) => result.status === "fulfilled",
  ).length;
  const failedCount = results.length - successCount;

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: `Message sent to ${successCount} user${successCount === 1 ? "" : "s"}${failedCount ? ` (${failedCount} failed)` : ""}`,
    data: {
      totalRecipients: users.length,
      successCount,
      failedCount,
      recipients: users.map((u) => ({ email: u.email, name: u.name })),
    },
  });
});

// ==================== SERVICE MANAGEMENT ====================

// Get all services (for admin dashboard)
exports.getAllServices = catchAsync(async (req, res, next) => {
  const services = await Service.find().sort({ createdAt: -1 });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    count: services.length,
    data: services,
  });
});

// ==================== SETTINGS ====================

exports.getSettings = catchAsync(async (req, res, next) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      restaurantName: "Yesekela Cafe",
      email: process.env.EMAIL_FROM,
      phone: "+251 123 456 789",
      address: "Addis Ababa, Ethiopia",
      openingHours: {
        monday_friday: "8:00 AM - 10:00 PM",
        saturday: "9:00 AM - 11:00 PM",
        sunday: "9:00 AM - 9:00 PM",
      },
    },
  });
});
