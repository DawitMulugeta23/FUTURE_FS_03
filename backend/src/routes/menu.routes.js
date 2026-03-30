const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menu.controller");
const { protect, admin } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validation.middleware");
const {
  createMenuSchema,
  updateMenuSchema,
} = require("../validations/menu.validation");

router.get("/", menuController.getAllMenuItems);
router.get("/specials", menuController.getSpecials);
router.get("/categories", menuController.getCategories);
router.get("/category/:category", menuController.getMenuByCategory);
router.get("/:id", menuController.getMenuItemById);

router.post(
  "/",
  protect,
  admin,
  validate(createMenuSchema),
  menuController.createMenuItem,
);
router.put(
  "/:id",
  protect,
  admin,
  validate(updateMenuSchema),
  menuController.updateMenuItem,
);
router.delete("/:id", protect, admin, menuController.deleteMenuItem);
router.patch(
  "/:id/availability",
  protect,
  admin,
  menuController.toggleAvailability,
);

module.exports = router;
