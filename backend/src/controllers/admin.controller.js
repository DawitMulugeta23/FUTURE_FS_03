const User = require("../models/User.model");
const Order = require("../models/Order.model");
const Menu = require("../models/Menu.model");
const Reservation = require("../models/Reservation.model");
const Review = require("../models/Review.model");
const catchAsync = require("../utils/catchAsync");
const { HTTP_STATUS } = require("../config/constants");

exports.getDashboardStats = catchAsync(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    totalOrders,
    totalRevenue,
    totalMenuItems,
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
      pendingReservations,
      pendingReviews,
      todayOrders,
      todayRevenue: todayRevenue[0]?.total || 0,
    },
  });
});

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

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const { role, isActive } = req.query;
  const filter = {};

  if (role) filter.role = role;
  if (isActive) filter.isActive = isActive === "true";

  const users = await User.find(filter)
    .select("-password")
    .sort({ createdAt: -1 });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    count: users.length,
    data: users,
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
