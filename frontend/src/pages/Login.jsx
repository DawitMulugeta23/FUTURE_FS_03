// frontend/src/pages/Login.jsx
import axios from "axios";
import { Coffee, Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useTheme } from "../context/useTheme";

const Login = () => {
  const { darkMode } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
      );
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      toast.success("Welcome back to Yesekela Café!");
      navigate("/menu");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login Failed");
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
        onSubmit={handleLogin}
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
            Welcome Back
          </h2>
          <p
            className={`text-sm mt-1 transition-colors duration-300 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Sign in to continue to Yesekela Café
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

          <div className="relative">
            <Lock
              size={18}
              className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                darkMode ? "text-gray-400" : "text-gray-400"
              }`}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
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

          <div className="text-right">
            <Link
              to="/forgot-password"
              className={`text-sm transition-colors duration-300 ${
                darkMode
                  ? "text-gray-400 hover:text-amber-400"
                  : "text-gray-500 hover:text-amber-600"
              }`}
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 text-white py-3 rounded-xl font-bold hover:bg-amber-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <LogIn size={18} />
            )}
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div
                className={`w-full border-t ${darkMode ? "border-gray-700" : "border-gray-300"}`}
              ></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className={`px-2 ${darkMode ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"}`}
              >
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Login Button */}
          <GoogleLoginButton />
        </div>

        <p
          className={`mt-4 text-center transition-colors duration-300 ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          New customer?{" "}
          <Link
            to="/register"
            className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
          >
            Create an account
          </Link>
        </p>

        <div
          className={`mt-6 pt-4 text-center border-t transition-colors duration-300 ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <p
            className={`text-xs transition-colors duration-300 ${
              darkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Demo credentials: demo@example.com / demo123
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
