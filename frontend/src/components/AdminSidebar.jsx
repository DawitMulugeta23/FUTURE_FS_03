// frontend/src/components/AdminSidebar.jsx
import {
  Bell,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  Moon,
  Settings,
  ShoppingBag,
  Sun,
  Users,
  Utensils,
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../context/useTheme";
import StockNotificationDropdown from "./Admin/StockNotificationDropdown";

const AdminSidebar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [showStockDropdown, setShowStockDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    window.location.href = "/login";
  };

  const menuItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
    { path: "/admin/menu", icon: Utensils, label: "Menu Manager" },
    { path: "/admin/orders", icon: ShoppingBag, label: "Orders" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/email", icon: Mail, label: "Email Campaign" },
    { path: "/admin/location", icon: MapPin, label: "Location" },
    { path: "/admin/settings", icon: Settings, label: "Settings" },
    { path: "/admin/feedback", icon: MessageSquare, label: "Feedback" },
  ];

  return (
    <div
      className={`h-screen w-64 fixed left-0 top-0 overflow-y-auto transition-colors duration-300 flex flex-col ${
        darkMode ? "bg-gray-900 text-white" : "bg-amber-900 text-white"
      }`}
    >
      <div className="p-6 flex-1">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <h2
            className={`text-2xl font-bold italic transition-colors duration-300 ${
              darkMode ? "text-amber-400" : "text-white"
            }`}
          >
            Yesekela Admin
          </h2>
          <p
            className={`text-xs mt-1 transition-colors duration-300 ${
              darkMode ? "text-gray-400" : "text-amber-200"
            }`}
          >
            Management Panel
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end || false}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? darkMode
                      ? "bg-amber-600 text-white shadow-lg"
                      : "bg-amber-700 text-white shadow-lg"
                    : darkMode
                      ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                      : "text-amber-100 hover:bg-amber-800 hover:text-white"
                }`
              }
            >
              <item.icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Section - Dark Mode, Stock Alerts, Logout */}
      <div className="p-6 border-t border-amber-800 dark:border-gray-700">
        {/* Stock Alerts Dropdown Button - Not a NavLink */}
        <div className="relative">
          <button
            onClick={() => setShowStockDropdown(!showStockDropdown)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 mb-2 ${
              darkMode
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                : "bg-amber-800 text-amber-100 hover:bg-amber-700 hover:text-white"
            }`}
          >
            <Bell size={20} />
            <span className="text-sm font-medium">Stock Alerts</span>
          </button>

          {/* Dropdown Menu */}
          {showStockDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowStockDropdown(false)}
              />
              <div
                className={`absolute bottom-full left-0 mb-2 w-64 rounded-xl shadow-xl z-50 overflow-hidden border ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <StockNotificationDropdown
                  onClose={() => setShowStockDropdown(false)}
                />
              </div>
            </>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 mb-2 ${
            darkMode
              ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
              : "bg-amber-800 text-amber-100 hover:bg-amber-700 hover:text-white"
          }`}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          <span className="text-sm font-medium">
            {darkMode ? "Light Mode" : "Dark Mode"}
          </span>
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            darkMode
              ? "bg-red-900/30 text-red-400 hover:bg-red-900/50 hover:text-red-300"
              : "bg-red-800/30 text-red-200 hover:bg-red-800/50 hover:text-red-100"
          }`}
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>

        {/* Version Info */}
        <div
          className={`mt-4 pt-4 text-center text-xs transition-colors duration-300 ${
            darkMode ? "text-gray-600" : "text-amber-700"
          }`}
        >
          <p>Yesekela Café v1.0</p>
          <p className="mt-1">© 2024 All rights reserved</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
