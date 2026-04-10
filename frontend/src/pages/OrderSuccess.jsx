// frontend/src/pages/OrderSuccess.jsx
import axios from "axios";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/useCart";

const API_URL =
  import.meta.env.VITE_API_URL || "https://future-fs-03-db4a.onrender.com/api";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [verifying, setVerifying] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const ref = searchParams.get("ref");
  const status = searchParams.get("status");

  useEffect(() => {
    const verifyPayment = async () => {
      if (ref && status === "success") {
        try {
          console.log("Verifying payment for ref:", ref);
          const response = await axios.get(`${API_URL}/orders/verify/${ref}`);
          console.log("Verification response:", response.data);
          setPaymentStatus("success");
        } catch (error) {
          console.error("Verification error:", error);
          setPaymentStatus("failed");
        }
      } else if (status === "failed") {
        setPaymentStatus("failed");
      } else {
        setPaymentStatus("pending");
      }
      setVerifying(false);
    };

    verifyPayment();
  }, [ref, status]);

  useEffect(() => {
    if (paymentStatus === "success") {
      clearCart();
      // Redirect to cart with flag to refresh discount after 2 seconds
      setTimeout(() => {
        navigate("/cart?order_placed=true");
      }, 2000);
    }
  }, [paymentStatus, clearCart, navigate]);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  const isFailed = paymentStatus === "failed";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-amber-50">
      <div className="max-w-xl w-full bg-white shadow-xl rounded-3xl p-8 text-center">
        <div
          className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${
            isFailed ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
          }`}
        >
          {isFailed ? <AlertCircle size={42} /> : <CheckCircle2 size={42} />}
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          {isFailed ? "Payment Not Completed" : "Order Confirmed!"}
        </h1>

        <p className="text-gray-600 text-lg leading-8">
          {isFailed
            ? "We could not verify your Chapa payment. Please try again or contact support if the issue continues."
            : "Thank you for ordering from Yesekela Café. Your payment has been verified and your order is now being prepared."}
        </p>

        {ref && (
          <p className="mt-4 text-sm text-gray-500">
            Reference:{" "}
            <span className="font-semibold text-gray-700">{ref}</span>
          </p>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to={isFailed ? "/cart" : "/myorders"}
            className="rounded-full bg-amber-600 px-6 py-3 font-bold text-white transition hover:bg-amber-700"
          >
            {isFailed ? "Try Again" : "View My Orders"}
          </Link>
          <Link
            to="/"
            className="rounded-full border border-amber-600 px-6 py-3 font-bold text-amber-700 hover:bg-amber-50"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
