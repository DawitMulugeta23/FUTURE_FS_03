// backend/src/routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderDetails,
  getAdminStats,
  deleteOrder,
  checkDiscountEligibility,
} = require("../controllers/order.Controller");
const { protect, authorize } = require("../middleware/authMiddleware");

// Public routes
router.get("/verify/:tx_ref", verifyPayment);

// Protected routes (require login)
router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/check-discount", protect, checkDiscountEligibility);

// Admin only routes
router.get("/stats", protect, authorize("admin"), getAdminStats);
router.get("/", protect, authorize("admin"), getAllOrders);
router.get("/:id", protect, authorize("admin"), getOrderDetails);
router.put("/:id/status", protect, authorize("admin"), updateOrderStatus);
router.delete("/:id", protect, authorize("admin"), deleteOrder);

module.exports = router;
