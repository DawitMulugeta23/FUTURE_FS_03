// frontend/src/pages/AdminDashboard.jsx
import axios from "axios";
import { Coffee, Download, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import DashboardStats from "../components/Admin/DashboardStats";
import EditMenuItem from "../components/Admin/EditMenuItem";
import FeedbackManager from "../components/Admin/FeedbackManager";
import MenuManager from "../components/Admin/MenuManager";
import OrdersManager from "../components/Admin/OrdersManager";
import UsersManager from "../components/Admin/UserManager";
import AdminSetting from "../components/AdminSetting";
import AdminSidebar from "../components/AdminSidebar";
import EmailCampaign from "../components/EmailCampaign";
import MapComponent from "../components/MapComponent";
import { useTheme } from "../context/useTheme";

const AdminDashboard = () => {
  const { darkMode } = useTheme();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalMenuItems: 0,
    todayOrders: 0,
    todayRevenue: 0,
    pendingOrders: 0,
  });
  const [analytics, setAnalytics] = useState({
    statusDistribution: [],
    topSellingItems: [],
    dailySales: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchMenuCount();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [ordersRes, usersRes] = await Promise.all([
        axios.get("https://future-fs-03-db4a.onrender.com/api/orders/stats", {
          headers,
        }),
        axios.get(
          "https://future-fs-03-db4a.onrender.com/api/admin/users/count",
          { headers },
        ),
      ]);

      setStats({
        totalOrders: ordersRes.data.stats.totalOrders,
        totalRevenue: ordersRes.data.stats.totalRevenue,
        totalUsers: usersRes.data.count,
        todayOrders: ordersRes.data.stats.todayOrders,
        todayRevenue: ordersRes.data.stats.todayRevenue,
        pendingOrders: ordersRes.data.stats.pendingOrders,
        totalMenuItems: 0,
      });

      setAnalytics({
        statusDistribution: ordersRes.data.analytics.statusDistribution,
        topSellingItems: ordersRes.data.analytics.topSellingItems,
        dailySales: ordersRes.data.analytics.dailySales,
      });
    } catch (err) {
      console.error("Error fetching stats", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuCount = async () => {
    try {
      const { data } = await axios.get(
        "https://future-fs-03-db4a.onrender.com/api/food",
      );
      setStats((prev) => ({ ...prev, totalMenuItems: data.data.length }));
    } catch (err) {
      console.error("Error fetching menu count", err);
    }
  };

  const exportToCSV = () => {
    const headers = ["Item Name", "Total Sold", "Total Revenue (ETB)"];
    const rows = analytics.topSellingItems.map((item) => [
      item.name,
      item.totalSold,
      item.totalRevenue,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales_report_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300",
      Preparing:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
      Delivered:
        "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
      Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
    );
  };

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}
    >
      <AdminSidebar />

      <div className="flex-1 ml-64">
        {/* Header with Notification Icon */}

        <div className="p-8">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <h1
                      className={`text-3xl font-bold transition-colors duration-300 ${darkMode ? "text-white" : "text-gray-800"}`}
                    >
                      Dashboard
                    </h1>
                    <button
                      onClick={exportToCSV}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      <Download size={18} /> Export Sales Report
                    </button>
                  </div>

                  <DashboardStats
                    stats={stats}
                    loading={loading}
                    darkMode={darkMode}
                  />

                  <div className="grid lg:grid-cols-2 gap-6 mt-8">
                    <div
                      className={`rounded-2xl shadow p-6 transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-white"}`}
                    >
                      <h3
                        className={`text-xl font-bold mb-4 flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-800"}`}
                      >
                        <TrendingUp
                          size={20}
                          className="text-amber-600 dark:text-amber-400"
                        />
                        Last 7 Days Sales
                      </h3>
                      <div className="space-y-3">
                        {analytics.dailySales.map((day, idx) => (
                          <div key={idx}>
                            <div className="flex justify-between text-sm mb-1">
                              <span
                                className={
                                  darkMode ? "text-gray-300" : "text-gray-600"
                                }
                              >
                                {day.date}
                              </span>
                              <span className="font-bold text-amber-600 dark:text-amber-400">
                                {day.revenue} ETB
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-amber-600 h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.min(100, (day.revenue / Math.max(...analytics.dailySales.map((d) => d.revenue), 1)) * 100)}%`,
                                }}
                              />
                            </div>
                            <div
                              className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
                            >
                              {day.orders} orders
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div
                      className={`rounded-2xl shadow p-6 transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-white"}`}
                    >
                      <h3
                        className={`text-xl font-bold mb-4 flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-800"}`}
                      >
                        <Coffee
                          size={20}
                          className="text-amber-600 dark:text-amber-400"
                        />
                        Top Selling Items
                      </h3>
                      <div className="space-y-3">
                        {analytics.topSellingItems
                          .slice(0, 5)
                          .map((item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center"
                            >
                              <div>
                                <p
                                  className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                                >
                                  {item.name}
                                </p>
                                <p
                                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                                >
                                  Sold: {item.totalSold}
                                </p>
                              </div>
                              <p className="font-bold text-amber-600 dark:text-amber-400">
                                {item.totalRevenue} ETB
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`rounded-2xl shadow p-6 mt-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
                  >
                    <h3
                      className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}
                    >
                      Order Status Distribution
                    </h3>
                    <div className="flex gap-4 flex-wrap">
                      {analytics.statusDistribution.map((status, idx) => (
                        <div key={idx} className="text-center">
                          <div
                            className={`px-4 py-2 rounded-lg ${getStatusColor(status._id)}`}
                          >
                            <p className="font-bold">{status._id}</p>
                            <p className="text-2xl font-bold">{status.count}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              }
            />

            <Route path="menu" element={<MenuManager />} />
            <Route path="menu/edit/:id" element={<EditMenuItem />} />
            <Route path="orders" element={<OrdersManager />} />
            <Route path="users" element={<UsersManager />} />
            <Route path="email" element={<EmailCampaign />} />
            <Route path="feedback" element={<FeedbackManager />} />
            <Route
              path="location"
              element={
                <div
                  className={`rounded-2xl shadow p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
                >
                  <h3
                    className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}
                  >
                    Our Location
                  </h3>
                  <MapComponent />
                  <div className="mt-6 grid md:grid-cols-2 gap-4">
                    <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-xl">
                      <h4
                        className={`font-bold mb-2 ${darkMode ? "text-amber-400" : "text-amber-900"}`}
                      >
                        Address
                      </h4>
                      <p
                        className={darkMode ? "text-gray-300" : "text-gray-700"}
                      >
                        Main Road, Near DBU Entrance
                      </p>
                      <p
                        className={darkMode ? "text-gray-300" : "text-gray-700"}
                      >
                        Debre Berhan, Ethiopia
                      </p>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-xl">
                      <h4
                        className={`font-bold mb-2 ${darkMode ? "text-amber-400" : "text-amber-900"}`}
                      >
                        Opening Hours
                      </h4>
                      <p
                        className={darkMode ? "text-gray-300" : "text-gray-700"}
                      >
                        Monday - Friday: 7:00 AM - 9:00 PM
                      </p>
                      <p
                        className={darkMode ? "text-gray-300" : "text-gray-700"}
                      >
                        Saturday - Sunday: 8:00 AM - 8:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              }
            />
            <Route path="settings" element={<AdminSetting />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
