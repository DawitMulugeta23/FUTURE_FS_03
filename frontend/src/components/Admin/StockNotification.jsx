// frontend/src/components/Admin/StockNotification.jsx
import { AlertCircle, Bell, Edit3, Package, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/useTheme";

const StockNotification = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [lowStockItems, setLowStockItems] = useState([]);
  const [outOfStockItems, setOutOfStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchLowStockItems();
    const interval = setInterval(fetchLowStockItems, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLowStockItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/food/admin/low-stock",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      if (data.success) {
        setLowStockItems(data.data.lowStock);
        setOutOfStockItems(data.data.outOfStock);
      }
    } catch (error) {
      console.error("Error fetching low stock:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuantity = () => {
    setShowDropdown(false);
    navigate("/admin/menu");
  };

  const handleEditItem = (itemId) => {
    setShowDropdown(false);
    navigate(`/admin/menu/edit/${itemId}`);
  };

  const totalIssues = lowStockItems.length + outOfStockItems.length;
  const hasIssues = totalIssues > 0;

  if (loading) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`relative p-2 rounded-full transition ${
          darkMode
            ? "hover:bg-gray-700 text-gray-300"
            : "hover:bg-gray-100 text-gray-600"
        }`}
      >
        <Bell size={20} />
        {hasIssues && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {totalIssues}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
          <div
            className={`absolute right-0 mt-2 w-80 rounded-xl shadow-xl z-50 overflow-hidden border ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div
              className={`p-3 border-b ${darkMode ? "border-gray-700" : "border-gray-100"}`}
            >
              <h3
                className={`font-bold flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-800"}`}
              >
                <Package size={18} className="text-amber-600" />
                Stock Alerts
              </h3>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {outOfStockItems.length > 0 && (
                <div className="p-3 border-b border-red-200 dark:border-red-900/30">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={16} className="text-red-500" />
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">
                      Out of Stock ({outOfStockItems.length})
                    </span>
                  </div>
                  {outOfStockItems.map((item) => (
                    <button
                      key={item._id}
                      onClick={() => handleEditItem(item._id)}
                      className={`w-full text-left block p-2 rounded-lg mb-1 transition ${
                        darkMode
                          ? "hover:bg-red-900/20 text-gray-300"
                          : "hover:bg-red-50 text-gray-700"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{item.name}</span>
                        <span className="text-xs font-bold text-red-500">
                          0 left
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {lowStockItems.length > 0 && (
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown size={16} className="text-yellow-500" />
                    <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                      Low Stock ({lowStockItems.length})
                    </span>
                  </div>
                  {lowStockItems.map((item) => (
                    <button
                      key={item._id}
                      onClick={() => handleEditItem(item._id)}
                      className={`w-full text-left block p-2 rounded-lg mb-1 transition ${
                        darkMode
                          ? "hover:bg-yellow-900/20 text-gray-300"
                          : "hover:bg-yellow-50 text-gray-700"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{item.name}</span>
                        <span
                          className={`text-xs font-bold ${
                            item.quantity <= 2
                              ? "text-red-500"
                              : "text-yellow-500"
                          }`}
                        >
                          {item.quantity} left
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {!hasIssues && (
                <div className="p-6 text-center">
                  <Package size={32} className="mx-auto mb-2 opacity-50" />
                  <p
                    className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                  >
                    All items are in stock
                  </p>
                </div>
              )}
            </div>

            <div
              className={`p-3 border-t ${darkMode ? "border-gray-700" : "border-gray-100"}`}
            >
              <button
                onClick={handleEditQuantity}
                className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition ${
                  darkMode
                    ? "bg-amber-600 text-white hover:bg-amber-700"
                    : "bg-amber-600 text-white hover:bg-amber-700"
                }`}
              >
                <Edit3 size={14} />
                Edit Quantity
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StockNotification;
