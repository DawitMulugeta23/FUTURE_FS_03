// backend/src/controllers/cart.controller.js
const Cart = require("../models/Cart");
const Food = require("../models/Food");

exports.getCart = async (req, res) => {
  try {
    console.log("Getting cart for user:", req.user.id);

    let cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
      "name price image quantity",
    );

    if (!cart) {
      console.log("No cart found, creating new cart for user:", req.user.id);
      cart = await Cart.create({
        user: req.user.id,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      });
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    console.log("Adding to cart:", {
      productId,
      quantity,
      userId: req.user.id,
    });

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        error: "Product ID and valid quantity are required",
      });
    }

    const product = await Food.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        error: `Only ${product.quantity} items available`,
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [],
      });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image,
      });
    }

    await cart.save();
    await cart.populate("items.product", "name price image quantity");

    res.status(200).json({
      success: true,
      data: cart,
      message: "Item added to cart successfully",
    });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 0) {
      return res.status(400).json({
        success: false,
        error: "Valid quantity is required",
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Item not found in cart",
      });
    }

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate("items.product", "name price image quantity");

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (err) {
    console.error("Update cart error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    await cart.save();
    await cart.populate("items.product", "name price image quantity");

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (err) {
    console.error("Remove from cart error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.buyNow = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        error: "Product ID and valid quantity are required",
      });
    }

    const product = await Food.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        error: `Only ${product.quantity} items available`,
      });
    }

    const orderItem = {
      _id: product._id,
      name: product.name,
      qty: quantity,
      price: product.price,
      image: product.image,
    };

    const totalPrice = product.price * quantity;

    res.status(200).json({
      success: true,
      orderItem: orderItem,
      totalPrice: totalPrice,
      message: "Proceed to checkout",
    });
  } catch (err) {
    console.error("Buy now error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
