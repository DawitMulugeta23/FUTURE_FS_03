const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const { protect, admin } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validation.middleware");
const {
  createReviewSchema,
  updateReviewSchema,
} = require("../validations/review.validation");

router.get("/menu/:menuId", reviewController.getReviewsByMenuItem);
router.get("/average/:menuId", reviewController.getAverageRating);
router.post(
  "/",
  protect,
  validate(createReviewSchema),
  reviewController.createReview,
);
router.put(
  "/:id",
  protect,
  validate(updateReviewSchema),
  reviewController.updateReview,
);
router.delete("/:id", protect, reviewController.deleteReview);

router.get("/", protect, admin, reviewController.getAllReviews);
router.patch("/:id/approve", protect, admin, reviewController.approveReview);

module.exports = router;
