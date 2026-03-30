// routes/service.routes.js
const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/service.controller");
const { protect, admin } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validation.middleware");
const {
  createServiceSchema,
  updateServiceSchema,
} = require("../validations/service.validation");

// Public routes
router.get("/", serviceController.getAllServices);
router.get("/popular", serviceController.getPopularServices);
router.get("/categories", serviceController.getServiceCategories);
router.get("/:id", serviceController.getServiceById);

// Admin only routes
router.post(
  "/",
  protect,
  admin,
  validate(createServiceSchema),
  serviceController.createService,
);
router.put(
  "/:id",
  protect,
  admin,
  validate(updateServiceSchema),
  serviceController.updateService,
);
router.delete("/:id", protect, admin, serviceController.deleteService);
router.patch(
  "/:id/availability",
  protect,
  admin,
  serviceController.toggleAvailability,
);

module.exports = router;
