// frontend/src/pages/Profile.jsx
import axios from "axios";
import { Mail, Phone, Save, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/useTheme";

const API_URL =
  import.meta.env.VITE_API_URL || "https://future-fs-03-db4a.onrender.com/api";

const Profile = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // ✅ Get token from localStorage
      const token = localStorage.getItem("token");
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (userInfo) {
        setFormData({
          name: userInfo.name || "",
          email: userInfo.email || "",
          phone: userInfo.phone || "",
        });
      }

      // ✅ Optionally fetch fresh data from API using the token
      if (token) {
        try {
          const response = await axios.get(`${API_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.success) {
            setFormData({
              name: response.data.user.name || "",
              email: response.data.user.email || "",
              phone: response.data.user.phone || "",
            });
          }
        } catch (err) {
          console.error("Error fetching from API:", err);
          // Fall back to localStorage data
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        navigate("/login");
        return;
      }

      const response = await axios.put(`${API_URL}/auth/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update localStorage with new user info
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const updatedUserInfo = { ...userInfo, ...response.data.user };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));

      toast.success("Profile updated successfully!");

      // Redirect to menu after 1.5 seconds
      setTimeout(() => {
        navigate("/menu");
      }, 1500);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen py-12 px-4 ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-amber-50 via-white to-orange-50"}`}
    >
      <div className="max-w-2xl mx-auto">
        <div
          className={`rounded-2xl shadow-xl p-8 ${darkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <div className="text-center mb-8">
            <div
              className={`inline-flex p-3 rounded-full mb-4 ${darkMode ? "bg-amber-900/50" : "bg-amber-100"}`}
            >
              <User size={40} className="text-amber-600 dark:text-amber-400" />
            </div>
            <h1
              className={`text-3xl font-bold ${darkMode ? "text-white" : "text-amber-900"}`}
            >
              Your Profile
            </h1>
            <p
              className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Update your information for a better experience
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Full Name
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={`w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                  required
                />
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Email Address (Required for payments)
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                  required
                  placeholder="your@email.com"
                />
              </div>
              <p
                className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
              >
                A valid email is required for Chapa payment processing
              </p>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className={`w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                  placeholder="+251-XXX-XXX-XXX"
                />
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-amber-600 text-white py-3 rounded-xl font-bold hover:bg-amber-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <Save size={18} />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/menu")}
                className="px-6 py-3 border border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>

          <div
            className={`mt-6 p-4 rounded-xl ${darkMode ? "bg-amber-900/20" : "bg-amber-50"}`}
          >
            <p
              className={`text-sm text-center ${darkMode ? "text-amber-400" : "text-amber-800"}`}
            >
              💡 Make sure your email is correct. Chapa sends payment
              confirmation to this email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
