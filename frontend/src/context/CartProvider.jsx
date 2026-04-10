import axios from "axios";
import { useEffect, useState } from "react";
import CartContext from "./cart-context";

const API_URL =
  import.meta.env.VITE_API_URL || "https://future-fs-03-db4a.onrender.com/api";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCartFromDatabase();
  }, []);

  const loadCartFromDatabase = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success && response.data.data.items) {
        const items = response.data.data.items.map((item) => ({
          _id: item.product._id || item.product,
          name: item.name,
          price: item.price,
          qty: item.quantity,
          image: item.image,
        }));
        setCartItems(items);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item, selectedQty = 1) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCartItems((prev) => {
        const existingItem = prev.find((i) => i._id === item._id);
        if (existingItem) {
          return prev.map((i) =>
            i._id === item._id ? { ...i, qty: i.qty + selectedQty } : i,
          );
        }
        return [...prev, { ...item, qty: selectedQty }];
      });
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/cart/add`,
        { productId: item._id, quantity: selectedQty },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        const items = response.data.data.items.map((cartItem) => ({
          _id: cartItem.product._id || cartItem.product,
          name: cartItem.name,
          price: cartItem.price,
          qty: cartItem.quantity,
          image: cartItem.image,
        }));
        setCartItems(items);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  const removeFromCart = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCartItems((prev) => prev.filter((item) => item._id !== id));
      return;
    }

    try {
      const response = await axios.delete(`${API_URL}/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const items = response.data.data.items.map((cartItem) => ({
          _id: cartItem.product._id || cartItem.product,
          name: cartItem.name,
          price: cartItem.price,
          qty: cartItem.quantity,
          image: cartItem.image,
        }));
        setCartItems(items);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, qty: quantity } : item,
        ),
      );
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/cart/${id}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        const items = response.data.data.items.map((cartItem) => ({
          _id: cartItem.product._id || cartItem.product,
          name: cartItem.name,
          price: cartItem.price,
          qty: cartItem.quantity,
          image: cartItem.image,
        }));
        setCartItems(items);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCartItems([]);
      return;
    }

    try {
      await axios.delete(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const buyNow = async (productId, quantity) => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Please login to continue");
    }

    try {
      const response = await axios.post(
        `${API_URL}/cart/buy-now`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      return response.data;
    } catch (error) {
      console.error("Buy now error:", error);
      throw error;
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.qty, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.qty, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        buyNow,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
