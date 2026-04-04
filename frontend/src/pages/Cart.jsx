// frontend/src/pages/Cart.jsx
import axios from "axios";
import { CreditCard, Minus, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom"; // ✅ Added Link import
import { useCart } from "../context/useCart";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const [showEmailWarning, setShowEmailWarning] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const isAdmin = userInfo?.role === "admin";

  const isValidEmail = (email) => {
    return email && email.includes("@") && email.includes(".");
  };

  useEffect(() => {
    if (isAdmin) {
      toast.error("Admin accounts cannot access the cart or place orders");
      navigate("/menu");
    }
  }, [isAdmin, navigate]);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0,
  );

  const handleCheckout = async () => {
    // Check for valid email first
    if (!userInfo?.email || !isValidEmail(userInfo.email)) {
      setShowEmailWarning(true);
      toast.error(
        "Please update your profile with a valid email address before placing an order. Go to Profile Settings.",
      );
      return;
    }

    if (!cartItems.length || isProcessing) return;

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to complete your order.");
      navigate("/login");
      return;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading("Initializing payment...");

    try {
      const formattedOrderItems = cartItems.map((item) => ({
        _id: item._id,
        name: item.name,
        qty: item.qty,
        price: item.price,
        image: item.image,
      }));

      const { data } = await axios.post(
        `${API_URL}/orders`,
        {
          orderItems: formattedOrderItems,
          totalPrice: Number(totalPrice),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 30000,
        },
      );

      toast.dismiss(loadingToast);

      if (data.success && data.checkout_url) {
        toast.success("Redirecting to payment...");
        clearCart();
        window.location.replace(data.checkout_url);
      } else {
        const errorMsg =
          typeof data.error === "string"
            ? data.error
            : data.message || "Unable to start payment";
        toast.error(errorMsg);
        setIsProcessing(false);
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error("Checkout error:", err);

      let errorMessage = "Unable to start payment. Please try again.";

      if (err.response?.data?.error) {
        if (typeof err.response.data.error === "string") {
          errorMessage = err.response.data.error;
        } else if (err.response.data.error?.message) {
          errorMessage = err.response.data.error.message;
        } else {
          errorMessage = "Payment initialization failed";
        }
      } else if (err.response?.data?.message) {
        if (typeof err.response.data.message === "string") {
          errorMessage = err.response.data.message;
        } else {
          errorMessage = "Validation error occurred";
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
      setIsProcessing(false);
    }
  };

  if (isAdmin) {
    return (
      <div className="container mx-auto p-6 max-w-4xl min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-2xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Access Restricted
          </h2>
          <p className="text-gray-600 mb-6">
            Admin accounts cannot place orders. Please use a customer account
            for ordering.
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-6 max-w-4xl min-h-screen">
        <div className="bg-white shadow-xl rounded-2xl p-8 text-center">
          <p className="text-gray-500 text-xl">
            Your cart is empty. Go grab some coffee!
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="mt-4 bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-amber-900">
        Your Shopping Cart
      </h2>

      {/* ✅ Warning Banner - Moved OUTSIDE the map loop */}
      {showEmailWarning && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-bold">⚠️ Invalid Email Address</p>
          <p>
            Please{" "}
            <Link to="/profile" className="underline font-bold">
              update your profile
            </Link>{" "}
            with a valid email address before placing an order.
          </p>
        </div>
      )}

      <div className="bg-white shadow-xl rounded-2xl p-6">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between border-b py-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <h4 className="font-bold text-lg">{item.name}</h4>
                <p className="text-gray-500">{item.price} ETB each</p>

                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item._id, item.qty - 1)}
                    className="rounded-lg bg-amber-100 p-1 text-amber-900 hover:bg-amber-200"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="min-w-8 text-center font-semibold text-gray-700">
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item._id, item.qty + 1)}
                    className="rounded-lg bg-amber-100 p-1 text-amber-900 hover:bg-amber-200"
                  >
                    <Plus size={16} />
                  </button>
                  <span className="ml-2 text-sm font-medium text-amber-700">
                    = {item.qty * item.price} ETB
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => removeFromCart(item._id)}
              className="text-red-500 hover:bg-red-50 p-2 rounded-full transition"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}

        <div className="mt-8 flex flex-col items-end">
          <h3 className="text-2xl font-bold mb-4">
            Total: <span className="text-amber-600">{totalPrice} ETB</span>
          </h3>
          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="bg-amber-600 text-white px-10 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-amber-700 transition shadow-lg w-full md:w-auto disabled:cursor-not-allowed disabled:opacity-70"
          >
            <CreditCard size={22} />
            {isProcessing
              ? "Processing..."
              : "Pay with Chapa (Telebirr/CBE Birr)"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
