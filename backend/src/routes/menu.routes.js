// backend/src/routes/menu.routes.js
const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menu.controller");
const { protect, authorize } = require("../middleware/authMiddleware");

// Public routes
router.get("/", menuController.getAllMenuItems);
router.get("/specials", menuController.getSpecials);
router.get("/categories", menuController.getCategories);
router.get("/category/:category", menuController.getMenuByCategory);
router.get("/:id", menuController.getMenuItemById);

// Protected admin routes
router.post("/", protect, authorize("admin"), menuController.createMenuItem);
router.put("/:id", protect, authorize("admin"), menuController.updateMenuItem);
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  menuController.deleteMenuItem,
);
router.patch(
  "/:id/availability",
  protect,
  authorize("admin"),
  menuController.toggleAvailability,
);

module.exports = router;
