// frontend/src/pages/ResetPassword.jsx
import axios from "axios";
import { CheckCircle, Coffee, Eye, EyeOff, Lock, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../context/useTheme";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [email, setEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/auth/validate-reset-token/${token}`,
      );

      if (response.data.success) {
        setTokenValid(true);
        setEmail(response.data.email);
      }
    } catch (error) {
      console.error("Token validation error:", error);
      setTokenValid(false);
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password, confirmPassword },
      );

      if (response.data.success) {
        setResetSuccess(true);
        toast.success(response.data.message);

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(error.response?.data?.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
          darkMode
            ? "bg-gray-900"
            : "bg-gradient-to-br from-amber-50 via-white to-orange-50"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 dark:border-amber-500 mx-auto mb-4"></div>
          <p
            className={`transition-colors duration-300 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Validating reset link...
          </p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-colors duration-300 px-4 ${
          darkMode
            ? "bg-gray-900"
            : "bg-gradient-to-br from-amber-50 via-white to-orange-50"
        }`}
      >
        <div
          className={`p-8 rounded-2xl shadow-xl w-full max-w-md text-center transition-colors duration-300 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="inline-flex p-3 rounded-full mb-4 bg-red-100 dark:bg-red-900/50">
            <XCircle size={40} className="text-red-600 dark:text-red-400" />
          </div>
          <h2
            className={`text-2xl font-bold mb-3 transition-colors duration-300 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Invalid or Expired Link
          </h2>
          <p
            className={`mb-6 transition-colors duration-300 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-colors duration-300 px-4 ${
          darkMode
            ? "bg-gray-900"
            : "bg-gradient-to-br from-amber-50 via-white to-orange-50"
        }`}
      >
        <div
          className={`p-8 rounded-2xl shadow-xl w-full max-w-md text-center transition-colors duration-300 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="inline-flex p-3 rounded-full mb-4 bg-green-100 dark:bg-green-900/50">
            <CheckCircle
              size={40}
              className="text-green-600 dark:text-green-400"
            />
          </div>
          <h2
            className={`text-2xl font-bold mb-3 transition-colors duration-300 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Password Reset Successful!
          </h2>
          <p
            className={`mb-6 transition-colors duration-300 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Your password has been successfully reset. You will be redirected to
            the login page.
          </p>
          <Link
            to="/login"
            className="inline-block bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

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
            Create New Password
          </h2>
          <p
            className={`text-sm mt-2 transition-colors duration-300 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Enter your new password for {email}
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Lock
              size={18}
              className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                darkMode ? "text-gray-400" : "text-gray-400"
              }`}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password (min 6 characters)"
              className={`w-full pl-10 pr-12 p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-colors duration-300 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                darkMode
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <Lock
              size={18}
              className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                darkMode ? "text-gray-400" : "text-gray-400"
              }`}
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              className={`w-full pl-10 pr-12 p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-colors duration-300 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
              }`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                darkMode
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 text-white py-3 rounded-xl font-bold hover:bg-amber-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <CheckCircle size={18} />
            )}
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className={`text-sm transition-colors duration-300 ${
              darkMode
                ? "text-gray-400 hover:text-amber-400"
                : "text-gray-600 hover:text-amber-600"
            }`}
          >
            Remember your password? Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
