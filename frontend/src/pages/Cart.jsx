// frontend/src/pages/Cart.jsx
import axios from "axios";
import { CreditCard, Gift, Minus, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const [showEmailWarning, setShowEmailWarning] = useState(false);
  const [discountInfo, setDiscountInfo] = useState({
    isEligible: false,
    discountPercentage: 0,
    message: "",
  });
  const [loadingDiscount, setLoadingDiscount] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const isAdmin = userInfo?.role === "admin";

  useEffect(() => {
    if (isAdmin) {
      toast.error("Admin accounts cannot access the cart or place orders");
      navigate("/menu");
    } else if (userInfo) {
      checkDiscountEligibility();
    }
  }, [isAdmin, navigate, userInfo]);

  const checkDiscountEligibility = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/orders/check-discount`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setDiscountInfo({
          isEligible: response.data.isEligible,
          discountPercentage: response.data.discountPercentage,
          message: response.data.message,
        });
      }
    } catch (error) {
      console.error("Error checking discount:", error);
    } finally {
      setLoadingDiscount(false);
    }
  };

  const isValidEmail = (email) => {
    return email && email.includes("@") && email.includes(".");
  };

  const calculateItemPrice = (item) => {
    const originalPrice = item.price;
    if (discountInfo.isEligible && originalPrice > 50) {
      const discountedPrice = originalPrice * 0.97;
      return {
        original: originalPrice,
        discounted: parseFloat(discountedPrice.toFixed(2)),
        hasDiscount: true,
      };
    }
    return {
      original: originalPrice,
      discounted: originalPrice,
      hasDiscount: false,
    };
  };

  const totalPrice = cartItems.reduce((acc, item) => {
    const priceInfo = calculateItemPrice(item);
    return acc + priceInfo.discounted * item.qty;
  }, 0);

  const originalTotalPrice = cartItems.reduce((acc, item) => {
    return acc + item.price * item.qty;
  }, 0);

  const totalDiscount = originalTotalPrice - totalPrice;

  const handleCheckout = async () => {
    if (!userInfo?.email || !isValidEmail(userInfo.email)) {
      setShowEmailWarning(true);
      toast.error(
        "Please update your profile with a valid email address before placing an order.",
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
      const formattedOrderItems = cartItems.map((item) => {
        const priceInfo = calculateItemPrice(item);
        return {
          _id: item._id,
          name: item.name,
          qty: item.qty,
          price: priceInfo.discounted,
          originalPrice: item.price,
          image: item.image,
        };
      });

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
        toast.success(
          data.discountApplied
            ? `First order discount of ${data.discountApplied}% applied!`
            : "Redirecting to payment...",
        );
        clearCart();
        window.location.replace(data.checkout_url);
      } else {
        toast.error(data.message || "Unable to start payment");
        setIsProcessing(false);
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error("Checkout error:", err);
      toast.error(err.response?.data?.error || "Unable to start payment");
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

      {!loadingDiscount && discountInfo.isEligible && (
        <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-lg">
          <div className="flex items-center gap-3">
            <Gift size={24} className="text-green-600" />
            <div>
              <p className="font-bold text-green-800">
                🎉 First Order Special!
              </p>
              <p className="text-sm text-green-700">
                {discountInfo.message} Items over 50 ETB will show discounted
                price.
              </p>
            </div>
          </div>
        </div>
      )}

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
        {cartItems.map((item) => {
          const priceInfo = calculateItemPrice(item);
          return (
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
                  {priceInfo.hasDiscount ? (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 line-through text-sm">
                        {priceInfo.original} ETB
                      </span>
                      <span className="text-green-600 font-bold">
                        {priceInfo.discounted} ETB
                      </span>
                      <span className="text-xs bg-green-100 text-green-700 px-1 rounded">
                        -3%
                      </span>
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      {priceInfo.discounted} ETB each
                    </p>
                  )}

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
                      = {priceInfo.discounted * item.qty} ETB
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
          );
        })}

        <div className="mt-8 flex flex-col items-end">
          {totalDiscount > 0 && (
            <div className="mb-2 text-right">
              <p className="text-gray-500 line-through">
                Original Total: {originalTotalPrice} ETB
              </p>
              <p className="text-green-600 font-semibold">
                First Order Discount (3%): -{totalDiscount.toFixed(2)} ETB
              </p>
            </div>
          )}
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
              : discountInfo.isEligible
                ? "Proceed to Checkout (3% First Order Discount)"
                : "Pay with Chapa (Telebirr/CBE Birr)"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
