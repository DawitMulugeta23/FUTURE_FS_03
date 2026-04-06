// backend/src/controllers/order.controller.js
const Order = require("../models/Order");
const Food = require("../models/Food");
const User = require("../models/User");
const axios = require("axios");

// Helper function to calculate discount
const calculateDiscountedPrice = (price, isFirstOrder) => {
  if (isFirstOrder && price > 50) {
    const discount = price * 0.03;
    return {
      discountedPrice: parseFloat((price - discount).toFixed(2)),
      originalPrice: price,
      discountApplied: 3,
    };
  }
  return {
    discountedPrice: price,
    originalPrice: price,
    discountApplied: 0,
  };
};

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

    // Check if this is user's first order
    const user = await User.findById(req.user.id);
    const isFirstOrder = !user.hasPlacedOrder;

    console.log(
      "Is first order:",
      isFirstOrder,
      "User has placed order:",
      user.hasPlacedOrder,
    );

    // Format order items with discount if first order
    const formattedItems = [];
    let calculatedTotalPrice = 0;
    let calculatedOriginalTotalPrice = 0;

    for (const item of orderItems) {
      // Verify stock
      const food = await Food.findById(item._id);
      if (!food) {
        return res.status(404).json({
          success: false,
          error: `Product ${item.name} not found`,
        });
      }
      if (food.quantity < (item.qty || 1)) {
        return res.status(400).json({
          success: false,
          error: `${food.name} has only ${food.quantity} items in stock.`,
        });
      }

      const quantity = item.qty || 1;
      const originalPrice = item.price;

      // Apply discount for first-time users on items > 50 ETB
      const { discountedPrice, discountApplied } = calculateDiscountedPrice(
        originalPrice,
        isFirstOrder,
      );

      const itemTotal = discountedPrice * quantity;
      const originalItemTotal = originalPrice * quantity;

      calculatedTotalPrice += itemTotal;
      calculatedOriginalTotalPrice += originalItemTotal;

      formattedItems.push({
        name: item.name,
        quantity: quantity,
        image: item.image,
        price: discountedPrice,
        originalPrice: originalPrice,
        discountedPrice: discountedPrice,
        product: item._id,
      });
    }

    // Use calculated total or provided totalPrice
    const finalTotalPrice = totalPrice || calculatedTotalPrice;
    const finalOriginalTotalPrice = calculatedOriginalTotalPrice;

    // Calculate total discount percentage
    const totalDiscountPercentage = isFirstOrder ? 3 : 0;

    // Generate transaction reference
    const tx_ref = "ORDER-" + req.user._id + "-" + Date.now();

    // Create order
    const order = await Order.create({
      user: req.user.id,
      orderItems: formattedItems,
      totalPrice: Number(finalTotalPrice),
      originalTotalPrice: Number(finalOriginalTotalPrice),
      discountApplied: totalDiscountPercentage,
      isPaid: false,
      status: "Pending",
      paymentReference: tx_ref,
    });

    // IMPORTANT: Mark user as having placed an order IMMEDIATELY
    // This removes discount eligibility even before payment
    if (isFirstOrder) {
      user.hasPlacedOrder = true;
      user.orderCount = (user.orderCount || 0) + 1;
      user.firstOrderDate = new Date();
      await user.save();
      console.log(
        `User ${user.email} has placed their first order! Discount eligibility removed.`,
      );
    }

    console.log("Order created:", order._id);
    console.log("Discount applied:", totalDiscountPercentage, "%");
    console.log(
      "Original total:",
      finalOriginalTotalPrice,
      "Discounted total:",
      finalTotalPrice,
    );

    // Prepare email for user
    let userEmail = req.user.email;
    const TEST_MODE = process.env.SKIP_EMAIL_VALIDATION_FOR_TESTING === "true";

    if (TEST_MODE) {
      userEmail = process.env.TEST_EMAIL || userEmail;
      console.log(`⚠️ TEST MODE: Using email: ${userEmail}`);
    }

    if (!userEmail || !isValidEmail(userEmail)) {
      console.error("Invalid email:", userEmail);
      return res.status(400).json({
        success: false,
        error: "Please update your profile with a valid email address.",
      });
    }

    // Prepare Chapa payment data
    const chapaData = {
      amount: Number(finalTotalPrice),
      currency: "ETB",
      email: userEmail,
      first_name: req.user.name?.split(" ")[0] || "Yesekela",
      last_name: req.user.name?.split(" ")[1] || "Customer",
      tx_ref: tx_ref,
      callback_url: `${process.env.FRONTEND_URL}/order-success`,
      return_url: `${process.env.FRONTEND_URL}/order-success`,
      title: "Yesekela Café Payment",
      description: `Order #${order._id}${isFirstOrder ? " (First Order - 3% Discount Applied)" : ""}`,
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
        discountApplied: totalDiscountPercentage,
        isFirstOrder: isFirstOrder,
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

// @route   DELETE /api/orders/:id
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    // If order is paid, restore stock before deleting
    if (order.isPaid) {
      for (const item of order.orderItems) {
        await Food.findByIdAndUpdate(item.product, {
          $inc: { quantity: item.quantity },
        });
      }
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (err) {
    console.error("Delete order error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
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

        // Update stock and soldCount
        for (const item of order.orderItems) {
          await Food.findByIdAndUpdate(item.product, {
            $inc: {
              quantity: -item.quantity,
              soldCount: item.quantity,
            },
          });
        }

        // Note: User's hasPlacedOrder is already set to true when order was created
        // No need to update it again here

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
      .populate("user", "name email phone hasPlacedOrder orderCount")
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
      "name email phone hasPlacedOrder orderCount",
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

    // Get today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayOrdersList = await Order.find({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    const todayOrders = todayOrdersList.length;
    const todayRevenue = todayOrdersList.reduce(
      (sum, order) => sum + (order.isPaid ? order.totalPrice : 0),
      0,
    );

    // Get first-time order stats
    const firstTimeOrders = await Order.find({ discountApplied: { $gt: 0 } });
    const totalDiscountGiven = firstTimeOrders.reduce(
      (sum, order) => sum + (order.originalTotalPrice - order.totalPrice),
      0,
    );

    res.status(200).json({
      success: true,
      stats: {
        totalOrders: totalOrders,
        totalRevenue: totalRevenue,
        pendingOrders: await Order.countDocuments({ status: "Pending" }),
        todayOrders: todayOrders,
        todayRevenue: todayRevenue,
        firstTimeOrders: firstTimeOrders.length,
        totalDiscountGiven: totalDiscountGiven,
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

// @desc    Check if user is eligible for first-time discount
// @route   GET /api/orders/check-discount
exports.checkDiscountEligibility = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const isEligible = !user.hasPlacedOrder;

    res.status(200).json({
      success: true,
      isEligible: isEligible,
      discountPercentage: isEligible ? 3 : 0,
      message: isEligible
        ? "You're eligible for 3% discount on your first order (items over 50 ETB)!"
        : "First-time discount already used. Check back for new promotions!",
    });
  } catch (err) {
    console.error("Check discount error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
