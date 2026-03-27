import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import DashboardStats from "../../components/admin/DashboardStats";
import MenuManager from "../../components/admin/MenuManager";
import AdminUsers from "./AdminUsers";
import apiClient from "../../services/api/apiClient";
const AdminDashboard = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/");
      toast.error("Access denied. Admin only.");
      return;
    }
    fetchDashboardStats();
  }, [isAuthenticated, user, navigate]);

  const fetchDashboardStats = async () => {
    try {
      const response = await apiClient.get("/admin/dashboard");
      setStats(response.data.data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-coffee-50">
      <AdminSidebar />
      <div className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-playfair font-bold text-coffee-800">
            Welcome back, {user?.name}
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your restaurant today
          </p>
        </div>

        <Routes>
          <Route
            index
            element={<DashboardStats stats={stats} isLoading={isLoading} />}
          />
            <Route index element={<DashboardStats stats={stats} isLoading={isLoading} />} />
            <Route path="menu" element={<MenuManager />} />
            <Route path="users" element={<AdminUsers />} />
          <Route path="menu" element={<MenuManager />} />
          <Route
            path="orders"
            element={
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Orders Management
                </h2>
                <p className="text-gray-500">
                  Orders management coming soon...
                </p>
              </div>
            }
          />
          <Route
            path="users"
            element={
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Users Management</h2>
                <p className="text-gray-500">Users management coming soon...</p>
              </div>
            }
          />
          <Route
            path="reservations"
            element={
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Reservations Management
                </h2>
                <p className="text-gray-500">
                  Reservations management coming soon...
                </p>
              </div>
            }
          />
          <Route
            path="reviews"
            element={
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Reviews Management
                </h2>
                <p className="text-gray-500">
                  Reviews management coming soon...
                </p>
              </div>
            }
          />
          <Route
            path="analytics"
            element={
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Analytics Dashboard
                </h2>
                <p className="text-gray-500">Analytics coming soon...</p>
              </div>
            }
          />
          <Route
            path="settings"
            element={
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Settings</h2>
                <p className="text-gray-500">Settings coming soon...</p>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
