import axios from "axios";
import { ArrowLeft, CheckCircle, Key, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/useTheme";

const VerifyResetCode = () => {
  const { darkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      toast.error("Email not found. Please request a new code.");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      toast.error("Please enter the 6-digit verification code");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://future-fs-03-db4a.onrender.com/api/auth/verify-reset-code",
        { email, code: verificationCode },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        // Navigate to reset password with the token
        navigate("/reset-password", {
          state: { resetToken: response.data.resetToken },
          replace: true,
        });
      }
    } catch (error) {
      console.error("Verify code error:", error);
      const errorMsg =
        error.response?.data?.error || "Invalid verification code";
      toast.error(errorMsg);
      // Clear the code inputs on error
      setCode(["", "", "", "", "", ""]);
      // Focus first input
      const firstInput = document.getElementById("code-input-0");
      if (firstInput) firstInput.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);

    try {
      const response = await axios.post(
        "https://future-fs-03-db4a.onrender.com/api/auth/forgot-password",
        { email },
      );

      if (response.data.success) {
        toast.success("New verification code sent to your email");
        setCode(["", "", "", "", "", ""]);
        // Focus first input
        const firstInput = document.getElementById("code-input-0");
        if (firstInput) firstInput.focus();
      }
    } catch (error) {
      console.error("Resend code error:", error);
      toast.error(error.response?.data?.error || "Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  if (!email) {
    return null; // Will redirect in useEffect
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 px-4 ${
        darkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-amber-50 via-white to-orange-50"
      }`}
    >
      <div
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
            <Shield size={32} className="text-amber-600 dark:text-amber-400" />
          </div>
          <h2
            className={`text-2xl font-bold transition-colors duration-300 ${
              darkMode ? "text-white" : "text-amber-900"
            }`}
          >
            Verify Your Code
          </h2>
          <p
            className={`text-sm mt-2 transition-colors duration-300 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            We've sent a 6-digit verification code to
          </p>
          <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mt-1">
            {email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-input-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-12 h-12 text-center text-2xl font-bold border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-colors duration-300 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                autoFocus={index === 0}
              />
            ))}
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
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleResendCode}
            disabled={resending}
            className={`text-sm transition-colors duration-300 flex items-center justify-center gap-1 w-full ${
              darkMode
                ? "text-gray-400 hover:text-amber-400"
                : "text-gray-600 hover:text-amber-600"
            }`}
          >
            {resending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-600 border-t-transparent" />
            ) : (
              <Key size={14} />
            )}
            {resending ? "Sending..." : "Resend Verification Code"}
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/forgot-password"
            className={`text-xs transition-colors duration-300 flex items-center justify-center gap-1 ${
              darkMode
                ? "text-gray-500 hover:text-gray-400"
                : "text-gray-500 hover:text-gray-600"
            }`}
          >
            <ArrowLeft size={12} />
            Use different email
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyResetCode;
