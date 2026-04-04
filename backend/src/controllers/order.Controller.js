// backend/src/controllers/order.controller.js
const Order = require("../models/Order");
const Food = require("../models/Food");
const axios = require("axios");

exports.createOrder = async (req, res) => {
  try {
    let { orderItems, totalPrice } = req.body;

    console.log("User email from token:", req.user.email);
    console.log("User name:", req.user.name);

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No order items",
      });
    }
    const isValidEmail = (email) => {
      return email && email.includes("@") && email.includes(".");
    };
    if (!req.user.email || !isValidEmail(req.user.email)) {
      return res.status(400).json({
        success: false,
        error:
          "Please update your profile with a valid email address before placing an order. go to Settings.",
      });
    }
    // Format order items
    const formattedItems = orderItems.map((item) => ({
      _id: item._id,
      name: item.name,
      quantity: item.qty || 1,
      price: item.price,
      image: item.image,
    }));

    // Verify stock
    for (const item of formattedItems) {
      const food = await Food.findById(item._id);
      if (!food) {
        return res.status(404).json({
          success: false,
          error: `Product ${item.name} not found`,
        });
      }
      if (food.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `${food.name} has only ${food.quantity} items in stock.`,
        });
      }
    }

    // Calculate total if not provided
    if (!totalPrice) {
      totalPrice = formattedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
    }

    // Generate transaction reference
    const tx_ref = "ORDER-" + req.user._id + "-" + Date.now();

    // Create order
    const order = await Order.create({
      user: req.user.id,
      orderItems: formattedItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        product: item._id,
      })),
      totalPrice: Number(totalPrice),
      isPaid: false,
      status: "Pending",
      paymentReference: tx_ref,
    });

    console.log("Order created:", order._id);

    // ✅ USE REAL EMAIL - Either from user or your Gmail for testing
    let userEmail = req.user.email;

    // For testing, use your REAL Gmail address
    const TEST_MODE = process.env.SKIP_EMAIL_VALIDATION_FOR_TESTING === "true";

    if (TEST_MODE) {
      // Use your REAL email address for testing
      userEmail = "dawitmulugetas23@gmail.com"; // ✅ CHANGE THIS TO YOUR REAL EMAIL
      console.log(`⚠️ TEST MODE: Using email: ${userEmail}`);
    }

    if (!userEmail || !isValidEmail(userEmail)) {
      console.error("Invalid email:", userEmail);
      return res.status(400).json({
        success: false,
        error:
          "Please update your profile with a valid email address. Current email is invalid.",
      });
    }

    // Prepare Chapa payment data
    const chapaData = {
      amount: Number(totalPrice),
      currency: "ETB",
      email: userEmail,
      first_name: req.user.name?.split(" ")[0] || "Yesekela",
      last_name: req.user.name?.split(" ")[1] || "Customer",
      tx_ref: tx_ref,
      callback_url: `${process.env.FRONTEND_URL}/order-success`,
      return_url: `${process.env.FRONTEND_URL}/order-success`,
      title: "Yesekela Café Payment",
      description: `Order #${order._id}`,
    };

    console.log("Sending to Chapa:", JSON.stringify(chapaData, null, 2));

    // Initialize Chapa payment
    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      chapaData,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      },
    );

    console.log("Chapa response:", response.data.status);

    if (
      response.data.status === "success" &&
      response.data.data?.checkout_url
    ) {
      return res.status(200).json({
        success: true,
        checkout_url: response.data.data.checkout_url,
        tx_ref: tx_ref,
        orderId: order._id,
      });
    } else {
      return res.status(400).json({
        success: false,
        error: response.data.message || "Payment initialization failed",
      });
    }
  } catch (err) {
    console.error("Create order error:", err.response?.data || err.message);

    let errorMessage = "Failed to create order";

    if (err.response?.data?.message) {
      if (typeof err.response.data.message === "object") {
        errorMessage = JSON.stringify(err.response.data.message);
      } else {
        errorMessage = err.response.data.message;
      }
    } else if (err.message) {
      errorMessage = err.message;
    }

    return res.status(400).json({
      success: false,
      error: errorMessage,
    });
  }
};

// @desc    Verify Chapa payment
// @route   GET /api/orders/verify/:tx_ref
exports.verifyPayment = async (req, res) => {
  try {
    const { tx_ref } = req.params;

    console.log("Verifying payment for tx_ref:", tx_ref);

    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
        timeout: 30000,
      },
    );

    console.log("Verification response status:", response.data.status);

    if (response.data.status === "success") {
      const order = await Order.findOne({ paymentReference: tx_ref });

      if (order && !order.isPaid) {
        order.isPaid = true;
        order.paidAt = new Date();
        order.status = "Preparing";
        await order.save();

        // Update stock
        for (const item of order.orderItems) {
          await Food.findByIdAndUpdate(item.product, {
            $inc: {
              quantity: -item.quantity,
              soldCount: item.quantity,
            },
          });
        }

        console.log(`Order ${order._id} marked as paid`);
      }
    }

    res.redirect(
      `${process.env.FRONTEND_URL}/order-success?ref=${tx_ref}&status=success`,
    );
  } catch (err) {
    console.error("Verify payment error:", err.response?.data || err.message);
    res.redirect(`${process.env.FRONTEND_URL}/order-success?status=failed`);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    console.error("Get my orders error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    console.error("Get all orders error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "Preparing", "Delivered", "Cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    if (status === "Cancelled" && !order.isPaid) {
      for (const item of order.orderItems) {
        await Food.findByIdAndUpdate(item.product, {
          $inc: { quantity: item.quantity },
        });
      }
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Get single order details
// @route   GET /api/orders/:id
exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email phone",
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    console.error("Get order details error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Get admin statistics
// @route   GET /api/orders/stats
exports.getAdminStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.find({ isPaid: true });
    const totalRevenue = paidOrders.reduce(
      (sum, order) => sum + order.totalPrice,
      0,
    );

    res.status(200).json({
      success: true,
      stats: {
        totalOrders: totalOrders,
        totalRevenue: totalRevenue,
        pendingOrders: await Order.countDocuments({ status: "Pending" }),
        todayOrders: 0,
        todayRevenue: 0,
      },
      analytics: {
        statusDistribution: [],
        topSellingItems: [],
        dailySales: [],
      },
    });
  } catch (err) {
    console.error("Get admin stats error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
