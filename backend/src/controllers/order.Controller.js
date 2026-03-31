const Order = require("../models/Order");
const Food = require("../models/Food");
const axios = require("axios");

// @desc    Create new order & Initialize Chapa Payment
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { orderItems, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // Generate a unique transaction reference
    const tx_ref = `tx-yesekela-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    // 1. Create order in Database
    const order = await Order.create({
      user: req.user.id,
      orderItems: orderItems.map((item) => ({
        name: item.name,
        quantity: item.qty,
        image: item.image,
        price: item.price,
        product: item._id,
      })),
      totalPrice,
      paymentReference: tx_ref,
    });

    // 2. Initialize Chapa Payment
    const chapaData = {
      amount: totalPrice,
      currency: "ETB",
      email: req.user.email,
      first_name: req.user.name.split(" ")[0],
      last_name: req.user.name.split(" ")[1] || "",
      tx_ref: tx_ref,
      callback_url: `${process.env.BASE_URL || "http://localhost:5000"}/api/orders/verify/${tx_ref}`,
      return_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/order-success`,
      customization: {
        title: "Yesekela Cafe Order",
        description: `Order #${order._id.toString().slice(-6)}`,
      },
    };

    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      chapaData,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    res.status(201).json({
      success: true,
      order,
      checkout_url: response.data.data.checkout_url,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Verify Chapa Payment
// @route   GET /api/orders/verify/:tx_ref
exports.verifyPayment = async (req, res) => {
  try {
    const { tx_ref } = req.params;

    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` },
      },
    );

    if (response.data.status === "success") {
      const order = await Order.findOneAndUpdate(
        { paymentReference: tx_ref },
        {
          isPaid: true,
          paidAt: Date.now(),
          status: "Preparing",
        },
        { new: true },
      );

      if (order) {
        // Update food items sold count
        for (const item of order.orderItems) {
          await Food.findByIdAndUpdate(item.product, {
            $inc: { soldCount: item.quantity },
          });
        }
      }

      res.redirect(
        `${process.env.FRONTEND_URL || "http://localhost:5173"}/order-success?ref=${tx_ref}`,
      );
    } else {
      res.redirect(
        `${process.env.FRONTEND_URL || "http://localhost:5173"}/order-failed`,
      );
    }
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort("-createdAt");
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get Admin Stats with Analytics
// @route   GET /api/orders/stats
exports.getAdminStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.find({ isPaid: true });

    // Calculate total revenue
    const totalRevenue = paidOrders.reduce(
      (acc, order) => acc + order.totalPrice,
      0,
    );
    const pendingOrders = await Order.countDocuments({ isPaid: false });

    // Get today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    const todayRevenue = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: { $gte: today, $lt: tomorrow },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    // Get order status distribution
    const statusDistribution = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get top selling items
    const topSellingItems = await Order.aggregate([
      { $match: { isPaid: true } },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product",
          name: { $first: "$orderItems.name" },
          totalSold: { $sum: "$orderItems.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] },
          },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
    ]);

    // Get daily sales for chart
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayRevenue = await Order.aggregate([
        {
          $match: {
            isPaid: true,
            createdAt: { $gte: date, $lt: nextDate },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalPrice" },
          },
        },
      ]);

      last7Days.push({
        date: date.toLocaleDateString("en-US", { weekday: "short" }),
        revenue: dayRevenue[0]?.total || 0,
        orders: await Order.countDocuments({
          createdAt: { $gte: date, $lt: nextDate },
        }),
      });
    }

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        paidCount: paidOrders.length,
        todayOrders,
        todayRevenue: todayRevenue[0]?.total || 0,
      },
      analytics: {
        statusDistribution,
        topSellingItems,
        dailySales: last7Days,
      },
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort("-createdAt");
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get order details
// @route   GET /api/orders/:id
exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("orderItems.product", "name price image");

    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
