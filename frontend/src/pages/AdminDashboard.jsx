import axios from "axios";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import DashboardStats from "../components/admin/DashboardStats";
import MenuManager from "../components/admin/MenuManager";
import OrdersManager from "../components/admin/OrdersManager";
import UsersManager from "../components/admin/UsersManager";
import AdminSetting from "../components/AdminSetting";
import EmailCampaign from "../components/EmailCampaign";
import MapComponent from "../components/MapComponent";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalMenuItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    fetchMenuCount();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [ordersRes, usersRes] = await Promise.all([
        axios.get("http://localhost:5000/api/orders/stats", { headers }),
        axios.get("http://localhost:5000/api/admin/users/count", { headers }),
      ]);

      setStats({
        totalOrders: ordersRes.data.stats.totalOrders,
        totalRevenue: ordersRes.data.stats.totalRevenue,
        totalUsers: usersRes.data.count,
        totalMenuItems: stats.totalMenuItems,
      });
    } catch (err) {
      console.error("Error fetching stats", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuCount = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/food");
      setStats((prev) => ({ ...prev, totalMenuItems: data.data.length }));
    } catch (err) {
      console.error("Error fetching menu count", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        <div className="p-8">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Dashboard
                  </h1>
                  <DashboardStats stats={stats} loading={loading} />

                  <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-white rounded-2xl shadow p-6">
                      <h3 className="text-xl font-bold mb-4">
                        Recent Activity
                      </h3>
                      <p className="text-gray-600">
                        Welcome to Yesekela Café Admin Panel
                      </p>
                    </div>
                    <div className="bg-white rounded-2xl shadow p-6">
                      <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                      <div className="space-y-2">
                        <button
                          onClick={() => navigate("/admin/menu")}
                          className="w-full text-left px-4 py-2 bg-amber-50 rounded-lg hover:bg-amber-100 transition"
                        >
                          ➕ Add New Menu Item
                        </button>
                        <button
                          onClick={() => navigate("/admin/orders")}
                          className="w-full text-left px-4 py-2 bg-amber-50 rounded-lg hover:bg-amber-100 transition"
                        >
                          📦 View Recent Orders
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              }
            />
            <Route path="/menu" element={<MenuManager />} />
            <Route path="/orders" element={<OrdersManager />} />
            <Route path="/users" element={<UsersManager />} />
            <Route path="/email" element={<EmailCampaign />} />
            <Route
              path="/location"
              element={
                <div className="bg-white rounded-2xl shadow p-6">
                  <h3 className="text-2xl font-bold mb-6 text-gray-800">
                    Our Location
                  </h3>
                  <MapComponent />
                  <div className="mt-6 grid md:grid-cols-2 gap-4">
                    <div className="bg-amber-50 p-4 rounded-xl">
                      <h4 className="font-bold text-amber-900 mb-2">Address</h4>
                      <p className="text-gray-700">
                        Main Road, Near DBU Entrance
                      </p>
                      <p className="text-gray-700">Debre Berhan, Ethiopia</p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-xl">
                      <h4 className="font-bold text-amber-900 mb-2">
                        Opening Hours
                      </h4>
                      <p className="text-gray-700">
                        Monday - Friday: 7:00 AM - 9:00 PM
                      </p>
                      <p className="text-gray-700">
                        Saturday - Sunday: 8:00 AM - 8:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              }
            />
            <Route path="/settings" element={<AdminSetting />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
