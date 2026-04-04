const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  buyNow,
} = require("../controllers/cart.controller");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/").get(getCart).delete(clearCart);

router.post("/add", addToCart);
router.post("/buy-now", buyNow);
router.put("/:productId", updateCartItem);
router.delete("/:productId", removeFromCart);

module.exports = router;
