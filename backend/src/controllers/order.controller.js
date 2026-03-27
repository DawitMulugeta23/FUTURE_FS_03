const Order = require("../models/Order.model");
const Menu = require("../models/Menu.model");
const { sendOrderConfirmation } = require("../utils/email.service");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { HTTP_STATUS, MESSAGES } = require("../config/constants");

exports.createOrder = catchAsync(async (req, res, next) => {
  const { items, paymentMethod, specialInstructions } = req.body;

  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const menuItem = await Menu.findById(item.menuItem);

    if (!menuItem) {
      return next(
        new AppError(
          `Menu item not found: ${item.menuItem}`,
          HTTP_STATUS.NOT_FOUND,
        ),
      );
    }

    if (!menuItem.isAvailable) {
      return next(
        new AppError(
          `${menuItem.name} is not available`,
          HTTP_STATUS.BAD_REQUEST,
        ),
      );
    }

    const itemTotal = menuItem.price * item.quantity;
    subtotal += itemTotal;

    orderItems.push({
      menuItem: menuItem._id,
      name: menuItem.name,
      quantity: item.quantity,
      price: menuItem.price,
      specialInstructions: item.specialInstructions,
    });
  }

  const tax = subtotal * 0.05;
  const totalAmount = subtotal + tax;

  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    subtotal,
    tax,
    totalAmount,
    paymentMethod,
    specialInstructions,
  });

  const populatedOrder = await Order.findById(order._id).populate(
    "user",
    "name email",
  );

  await sendOrderConfirmation(populatedOrder, req.user);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: MESSAGES.CREATED,
    data: order,
  });
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id }).sort({
    createdAt: -1,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

exports.getOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email phone",
  );

  if (!order) {
    return next(new AppError("Order not found", HTTP_STATUS.NOT_FOUND));
  }

  if (order.user._id.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new AppError("Not authorized", HTTP_STATUS.FORBIDDEN));
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: order,
  });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const { status, startDate, endDate } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (startDate && endDate) {
    filter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const orders = await Order.find(filter)
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("Order not found", HTTP_STATUS.NOT_FOUND));
  }

  order.status = status;
  order.updatedAt = Date.now();
  await order.save();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.UPDATED,
    data: order,
  });
});

exports.cancelOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("Order not found", HTTP_STATUS.NOT_FOUND));
  }

  if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new AppError("Not authorized", HTTP_STATUS.FORBIDDEN));
  }

  if (order.status !== "pending" && order.status !== "confirmed") {
    return next(
      new AppError(
        "Order cannot be cancelled at this stage",
        HTTP_STATUS.BAD_REQUEST,
      ),
    );
  }

  order.status = "cancelled";
  await order.save();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Order cancelled successfully",
    data: order,
  });
});

exports.getDailyAnalytics = catchAsync(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const orders = await Order.find({
    createdAt: { $gte: today },
    status: { $ne: "cancelled" },
  });

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0,
  );
  const totalOrders = orders.length;

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      totalRevenue,
      totalOrders,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    },
  });
});
