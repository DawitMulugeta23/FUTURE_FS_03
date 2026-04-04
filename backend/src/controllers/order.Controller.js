// backend/src/controllers/order.Controller.js
const Order = require("../models/Order");
const Food = require("../models/Food");
const axios = require("axios");

const CHAPA_BASE_URL = process.env.CHAPA_BASE_URL || "https://api.chapa.co/v1";

const getBackendBaseUrl = (req) =>
  process.env.BACKEND_URL ||
  process.env.BASE_URL ||
  `${req.protocol}://${req.get("host")}`;

const getFrontendBaseUrl = () =>
  process.env.FRONTEND_URL || "http://localhost:5173";

// @desc    Create new order & Initialize Chapa Payment
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    // PREVENT ADMINS FROM PLACING ORDERS
    if (req.user.role === "admin") {
      return res.status(403).json({
        success: false,
        error:
          "Admins cannot place orders. Please use a customer account for ordering.",
      });
    }

    const { orderItems, totalPrice } = req.body;

    if (!process.env.CHAPA_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        error: "Chapa payment is not configured on the server.",
      });
    }

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, error: "No order items" });
    }

    if (!totalPrice || Number(totalPrice) <= 0) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid order total" });
    }

    const tx_ref = `tx-yesekela-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const verificationUrl = `${getBackendBaseUrl(req)}/api/orders/verify/${tx_ref}`;

    const order = await Order.create({
      user: req.user.id,
      orderItems: orderItems.map((item) => ({
        name: item.name,
        quantity: item.qty,
        image: item.image,
        price: item.price,
        product: item._id,
      })),
      totalPrice: Number(totalPrice),
      paymentReference: tx_ref,
      status: "Pending",
    });

    const chapaData = {
      amount: Number(totalPrice).toFixed(2),
      currency: "ETB",
      email: req.user.email,
      first_name: req.user.name?.split(" ")[0] || "Yesekela",
      last_name: req.user.name?.split(" ").slice(1).join(" ") || "Customer",
      tx_ref,
      callback_url: verificationUrl,
      return_url: verificationUrl,
      customization: {
        title: "Yesekela Cafe Order",
        description: `Order #${order._id.toString().slice(-6)}`,
      },
    };

    const response = await axios.post(
      `${CHAPA_BASE_URL}/transaction/initialize`,
      chapaData,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const checkoutUrl = response.data?.data?.checkout_url;

    if (!checkoutUrl) {
      return res.status(502).json({
        success: false,
        error: "Payment gateway did not return a checkout URL.",
      });
    }

    res.status(201).json({
      success: true,
      order,
      checkout_url: checkoutUrl,
    });
  } catch (err) {
    console.error("Create order error:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      error: err.response?.data?.message || err.message,
    });
  }
};

// Rest of the file remains the same...
exports.verifyPayment = async (req, res) => {
  const frontendUrl = getFrontendBaseUrl();

  try {
    const { tx_ref } = req.params;

    if (!process.env.CHAPA_SECRET_KEY) {
      return res.redirect(
        `${frontendUrl}/order-success?status=failed&ref=${encodeURIComponent(tx_ref)}`,
      );
    }

    const order = await Order.findOne({ paymentReference: tx_ref });

    if (!order) {
      return res.redirect(
        `${frontendUrl}/order-success?status=failed&ref=${encodeURIComponent(tx_ref)}`,
      );
    }

    const response = await axios.get(
      `${CHAPA_BASE_URL}/transaction/verify/${tx_ref}`,
      {
        headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` },
      },
    );

    const paymentSuccessful =
      response.data?.status === "success" &&
      response.data?.data?.status === "success";

    if (paymentSuccessful) {
      if (!order.isPaid) {
        order.isPaid = true;
        order.paidAt = new Date();
        order.status = order.status === "Pending" ? "Preparing" : order.status;
        await order.save();

        await Promise.all(
          order.orderItems.map((item) =>
            item.product
              ? Food.findByIdAndUpdate(item.product, {
                  $inc: { soldCount: item.quantity },
                })
              : Promise.resolve(),
          ),
        );
      }

      return res.redirect(
        `${frontendUrl}/order-success?status=success&ref=${encodeURIComponent(tx_ref)}`,
      );
    }

    return res.redirect(
      `${frontendUrl}/order-success?status=failed&ref=${encodeURIComponent(tx_ref)}`,
    );
  } catch (err) {
    console.error(
      "Payment verification error:",
      err.response?.data || err.message,
    );
    return res.redirect(
      `${frontendUrl}/order-success?status=failed&ref=${encodeURIComponent(req.params.tx_ref)}`,
    );
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort("-createdAt");
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.find({ isPaid: true });

    const totalRevenue = paidOrders.reduce(
      (acc, order) => acc + order.totalPrice,
      0,
    );
    const pendingOrders = await Order.countDocuments({ isPaid: false });

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

    const statusDistribution = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

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
