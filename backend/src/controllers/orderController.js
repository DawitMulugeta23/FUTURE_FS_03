const Order = require('../models/Order');
const axios = require('axios');

// @desc    Create new order & Initialize Chapa Payment
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { orderItems, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Generate a unique transaction reference
    const tx_ref = `tx-yesekela-${Date.now()}`;

    // 1. Create order in our Database
    const order = await Order.create({
      user: req.user.id, // Assuming you have auth middleware
      orderItems,
      totalPrice,
      paymentReference: tx_ref
    });

    // 2. Initialize Chapa Payment
    const chapaData = {
      amount: totalPrice,
      currency: 'ETB',
      email: req.user.email,
      first_name: req.user.name,
      tx_ref: tx_ref,
      callback_url: `http://localhost:5000/api/orders/verify/${tx_ref}`,
      return_url: `http://localhost:3000/order-success`, // Frontend success page
      "customization[title]": "Yesekela Cafe Order",
      "customization[description]": "Payment for your coffee/food order"
    };

    const response = await axios.post('https://api.chapa.co/v1/transaction/initialize', chapaData, {
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Send the Chapa checkout URL to the frontend
    res.status(201).json({
      success: true,
      order,
      checkout_url: response.data.data.checkout_url
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
// @desc    Verify Chapa Payment
// @route   GET /api/orders/verify/:tx_ref
exports.verifyPayment = async (req, res) => {
  try {
    const { tx_ref } = req.params;

    const response = await axios.get(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
      headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` }
    });

    if (response.data.status === 'success') {
      // Update order in DB to "Paid"
      await Order.findOneAndUpdate({ paymentReference: tx_ref }, {
        isPaid: true,
        paidAt: Date.now(),
        status: 'Preparing'
      });

      res.redirect(`http://localhost:3000/order-success?ref=${tx_ref}`);
    }
  } catch (err) {
    res.status(500).json({ message: 'Payment verification failed' });
  }
};
// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
// @desc    Get Admin Stats
// @route   GET /api/orders/stats
exports.getAdminStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.find({ isPaid: true });
    
    // Calculate total revenue from paid orders
    const totalRevenue = paidOrders.reduce((acc, order) => acc + order.totalPrice, 0);
    const pendingOrders = await Order.countDocuments({ isPaid: false });

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        paidCount: paidOrders.length
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};