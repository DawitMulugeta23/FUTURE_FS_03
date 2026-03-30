const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware'); // You'll need this middleware
const { createOrder, verifyPayment, getMyOrders } = require('../controllers/orderController');

router.route('/').post(protect, createOrder);
router.route('/verify/:tx_ref').get(verifyPayment);
router.route('/myorders').get(protect, getMyOrders);
module.exports = router;