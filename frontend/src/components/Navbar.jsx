// frontend/src/components/Navbar.jsx
import {
  ChevronDown,
  ClipboardList,
  Coffee,
  LogOut,
  MessageSquare,
  Moon,
  ShoppingCart,
  Sun,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";
import { useTheme } from "../context/useTheme";
import FeedbackModal from "./FeedbackModal";

const Navbar = () => {
  const { cartItems } = useCart();
  const { darkMode, toggleDarkMode } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const itemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [showFeedback, setShowFeedback] = useState(false);

  // Check if user is logged in and admin
  const isLoggedIn = !!userInfo;
  const isAdmin = userInfo?.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-amber-900 text-white"
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left Side: Logo */}
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <Coffee size={28} className="text-amber-400" />
          <span>Yesekela Café</span>
        </Link>

        {/* Center: Navigation Links */}
        <div className="flex gap-6 items-center">
          <Link
            to="/about"
            className="hover:text-amber-400 transition font-medium"
          >
            About
          </Link>
          <Link
            to="/menu"
            className="hover:text-amber-400 transition font-medium"
          >
            Menu
          </Link>
          {isLoggedIn && !isAdmin && (
            <Link
              to="/myorders"
              className="hover:text-amber-400 transition font-medium"
            >
              Orders
            </Link>
          )}
          <Link
            to="/contact"
            className="hover:text-amber-400 transition font-medium"
          >
            Contact
          </Link>
        </div>

        {/* Right Side: Cart, Dark Mode, User Profile */}
        <div className="flex gap-4 items-center">
          {/* Cart Icon - Only for logged-in non-admin users */}
          {isLoggedIn && !isAdmin && (
            <Link
              to="/cart"
              className="relative p-2 rounded-full hover:bg-amber-800 dark:hover:bg-gray-700 transition"
            >
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-amber-800 dark:hover:bg-gray-700 transition"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* User Profile / Login */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-amber-700 dark:bg-gray-700 px-3 py-2 rounded-full text-sm font-bold flex items-center gap-1 hover:bg-amber-600 dark:hover:bg-gray-600 transition"
              >
                <User size={16} />
                {userInfo.name.split(" ")[0]}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu - Dark Mode Applied */}
              {isDropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl py-2 z-50 border transition-colors duration-300 ${
                    darkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-100"
                  }`}
                >
                  {/* Feedback option inside dropdown */}
                  <button
                    onClick={() => {
                      setShowFeedback(true);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-300 ${
                      darkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-amber-50"
                    }`}
                  >
                    <MessageSquare size={16} /> Give Feedback
                  </button>

                  {userInfo.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setIsDropdownOpen(false)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-300 ${
                        darkMode
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-amber-50"
                      }`}
                    >
                      <ClipboardList size={16} /> Admin Dashboard
                    </Link>
                  )}

                  {/* Only show My Orders in dropdown for non-admin users */}
                  {!isAdmin && (
                    <Link
                      to="/myorders"
                      onClick={() => setIsDropdownOpen(false)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-300 ${
                        darkMode
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-amber-50"
                      }`}
                    >
                      <ClipboardList size={16} /> My Orders
                    </Link>
                  )}

                  <hr
                    className={`my-1 transition-colors duration-300 ${
                      darkMode ? "border-gray-700" : "border-gray-100"
                    }`}
                  />

                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-300 ${
                      darkMode
                        ? "text-red-400 hover:bg-gray-700"
                        : "text-red-600 hover:bg-red-50"
                    }`}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hover:text-amber-400 transition font-medium"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
      />
    </nav>
  );
};

export default Navbar;
