import {
  ChevronDown,
  ClipboardList,
  Coffee,
  LogOut,
  Moon,
  ShoppingCart,
  Sun,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";
import { useTheme } from "../context/useTheme";

const Navbar = () => {
  const { cartItems } = useCart();
  const { darkMode, toggleDarkMode } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const itemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

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

        {/* Right Side: Navigation Links */}
        <div className="flex gap-4 items-center">
          <Link
            to="/menu"
            className="hover:text-amber-400 transition font-medium"
          >
            Menu
          </Link>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-amber-800 transition"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Cart Icon - NOW FIRST */}
          <Link
            to="/cart"
            className="relative p-2 rounded-full hover:bg-amber-800 transition"
          >
            <ShoppingCart size={22} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Link>

          {/* User Icon - NOW SECOND */}
          {userInfo ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-amber-700 px-3 py-2 rounded-full text-sm font-bold flex items-center gap-1 hover:bg-amber-600 transition"
              >
                <User size={16} />
                {userInfo.name.split(" ")[0]}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100">
                  {userInfo.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-amber-50 transition text-sm"
                    >
                      <ClipboardList size={16} /> Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/myorders"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-amber-50 transition text-sm"
                  >
                    <ClipboardList size={16} /> My Orders
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition text-sm text-left"
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
    </nav>
  );
};

export default Navbar;
