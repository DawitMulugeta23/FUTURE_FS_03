// frontend/src/pages/Register.jsx
import axios from "axios";
import { Coffee, Eye, EyeOff, Lock, Mail, User, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/useTheme";

const Register = () => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // Create submit data without confirmPassword
      const submitData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        submitData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));

      toast.success("Registration successful! Welcome to Yesekela Café!");
      navigate("/menu");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 px-4 py-8 ${
        darkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-amber-50 via-white to-orange-50"
      }`}
    >
      <form
        onSubmit={handleRegister}
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
            Join Yesekela
          </h2>
          <p
            className={`text-sm mt-1 transition-colors duration-300 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Create your account to start ordering
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <User
              size={18}
              className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                darkMode ? "text-gray-400" : "text-gray-400"
              }`}
            />
            <input
              type="text"
              placeholder="Full Name"
              className={`w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-colors duration-300 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
              }`}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

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
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
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
              placeholder="Password (min 6 characters)"
              className={`w-full pl-10 pr-12 p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-colors duration-300 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
              }`}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
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
              placeholder="Confirm Password"
              className={`w-full pl-10 pr-12 p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-colors duration-300 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
              }`}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
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
              <UserPlus size={18} />
            )}
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </div>

        <p
          className={`mt-4 text-center transition-colors duration-300 ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
          >
            Sign In
          </Link>
        </p>

        <div
          className={`mt-6 pt-4 text-center border-t transition-colors duration-300 ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <Link
            to="/register/admin"
            className={`text-xs hover:underline transition-colors duration-300 ${
              darkMode
                ? "text-gray-500 hover:text-amber-400"
                : "text-gray-400 hover:text-amber-600"
            }`}
          >
            Admin Registration
          </Link>
          <span
            className={`mx-2 text-xs ${darkMode ? "text-gray-600" : "text-gray-300"}`}
          >
            •
          </span>
          <Link
            to="/register/staff"
            className={`text-xs hover:underline transition-colors duration-300 ${
              darkMode
                ? "text-gray-500 hover:text-amber-400"
                : "text-gray-400 hover:text-amber-600"
            }`}
          >
            Staff Registration
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
