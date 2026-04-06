// frontend/src/pages/ForgotPassword.jsx
import axios from "axios";
import { ArrowLeft, Coffee, Mail, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/useTheme";

const ForgotPassword = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        // Navigate AFTER successful API call, not during render
        navigate("/verify-reset-code", {
          state: { email: response.data.email || email },
        });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(
        error.response?.data?.error || "Failed to send verification code",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 px-4 ${
        darkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-amber-50 via-white to-orange-50"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className={`p-8 rounded-2xl shadow-xl w-full max-w-md transition-colors duration-300 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="text-center mb-6">
          <div
            className={`inline-flex p-3 rounded-full mb-3 ${
              darkMode ? "bg-amber-900/50" : "bg-amber-100"
            }`}
          >
            <Coffee size={32} className="text-amber-600 dark:text-amber-400" />
          </div>
          <h2
            className={`text-3xl font-bold transition-colors duration-300 ${
              darkMode ? "text-white" : "text-amber-900"
            }`}
          >
            Forgot Password?
          </h2>
          <p
            className={`text-sm mt-2 transition-colors duration-300 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Enter your email address and we'll send you a 6-digit verification
            code.
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Mail
              size={18}
              className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                darkMode ? "text-gray-400" : "text-gray-400"
              }`}
            />
            <input
              type="email"
              placeholder="Email Address"
              className={`w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-colors duration-300 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 text-white py-3 rounded-xl font-bold hover:bg-amber-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <Send size={18} />
            )}
            {loading ? "Sending..." : "Send Verification Code"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className={`text-sm transition-colors duration-300 flex items-center justify-center gap-1 ${
              darkMode
                ? "text-gray-400 hover:text-amber-400"
                : "text-gray-600 hover:text-amber-600"
            }`}
          >
            <ArrowLeft size={14} />
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
