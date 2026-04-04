import axios from "axios";
import { CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Checkout = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderItem, setOrderItem] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const buyNowData = sessionStorage.getItem("buyNowItem");

    if (!buyNowData) {
      toast.error("No item to checkout");
      navigate("/menu");
      return;
    }

    try {
      const { item, totalPrice: price } = JSON.parse(buyNowData);
      setOrderItem(item);
      setTotalPrice(price);
    } catch (error) {
      console.error("Error parsing checkout data:", error);
      toast.error("Invalid checkout data");
      navigate("/menu");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleCheckout = async () => {
    if (!orderItem) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to complete your order.");
      navigate("/login");
      return;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading("Initializing payment...");

    try {
      const { data } = await axios.post(
        `${API_URL}/orders`,
        {
          orderItems: [orderItem],
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
        sessionStorage.removeItem("buyNowItem");
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!orderItem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No item to checkout</p>
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

  return (
    <div className="container mx-auto p-6 max-w-2xl min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-amber-900">Checkout</h2>

      <div className="bg-white shadow-xl rounded-2xl p-6">
        <div className="flex items-center gap-4 border-b pb-4">
          <img
            src={orderItem.image}
            alt={orderItem.name}
            className="w-20 h-20 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h4 className="font-bold text-lg">{orderItem.name}</h4>
            <p className="text-gray-500">{orderItem.price} ETB each</p>
            <p className="text-sm text-gray-600">Quantity: {orderItem.qty}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-amber-600">
              {orderItem.price * orderItem.qty} ETB
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <p className="text-lg font-bold">Total Amount:</p>
          <p className="text-2xl font-bold text-amber-600">{totalPrice} ETB</p>
        </div>

        <button
          onClick={handleCheckout}
          disabled={isProcessing}
          className="mt-6 w-full bg-amber-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-amber-700 transition disabled:opacity-50"
        >
          <CreditCard size={22} />
          {isProcessing ? "Processing..." : "Pay with Chapa"}
        </button>

        <button
          onClick={() => navigate("/menu")}
          className="mt-4 w-full py-3 border border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default Checkout;
