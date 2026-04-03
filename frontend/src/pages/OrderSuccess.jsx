import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/useCart";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();

  const ref = searchParams.get("ref");
  const rawStatus = searchParams.get("status");
  const status = rawStatus || (ref ? "processing" : "success");
  const isSuccess = status === "success";
  const isFailed = status === "failed";

  useEffect(() => {
    if (isSuccess) {
      clearCart();
    }
  }, [isSuccess, clearCart]);

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
