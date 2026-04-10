// frontend/src/components/AdminSetting.jsx
import axios from "axios";
import { CheckCircle, Save, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTheme } from "../context/useTheme";

const AdminSetting = () => {
  const { darkMode } = useTheme();
  const [settings, setSettings] = useState({
    cafeName: "Yesekela Café",
    email: "info@yesekelacafe.com",
    phone: "+251-911-123456",
    address: "Main Road, Near DBU Entrance",
    city: "Debre Berhan",
    openingHours: "7:00 AM - 9:00 PM",
    deliveryFee: 0,
    minimumOrder: 0,
    taxRate: 0,
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        "https://future-fs-03-db4a.onrender.com/api/admin/settings",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error("Error fetching settings", err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "https://future-fs-03-db4a.onrender.com/api/admin/settings",
        settings,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setSaved(true);
      toast.success("Settings saved successfully!");
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      toast.error("Failed to save settings");
      console.error("Error saving settings", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`rounded-2xl shadow p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
    >
      <h3
        className={`text-2xl font-bold mb-6 flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-800"}`}
      >
        <Settings className="text-amber-600 dark:text-amber-400" /> Cafe
        Settings
      </h3>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Cafe Name
            </label>
            <input
              type="text"
              value={settings.cafeName}
              onChange={(e) =>
                setSettings({ ...settings, cafeName: e.target.value })
              }
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Email
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) =>
                setSettings({ ...settings, email: e.target.value })
              }
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Phone
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) =>
                setSettings({ ...settings, phone: e.target.value })
              }
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Opening Hours
            </label>
            <input
              type="text"
              value={settings.openingHours}
              onChange={(e) =>
                setSettings({ ...settings, openingHours: e.target.value })
              }
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          <div className="md:col-span-2">
            <label
              className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Address
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) =>
                setSettings({ ...settings, address: e.target.value })
              }
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              City
            </label>
            <input
              type="text"
              value={settings.city}
              onChange={(e) =>
                setSettings({ ...settings, city: e.target.value })
              }
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Delivery Fee (ETB)
            </label>
            <input
              type="number"
              value={settings.deliveryFee}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  deliveryFee: parseFloat(e.target.value),
                })
              }
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Minimum Order (ETB)
            </label>
            <input
              type="number"
              value={settings.minimumOrder}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  minimumOrder: parseFloat(e.target.value),
                })
              }
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Tax Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={settings.taxRate}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  taxRate: parseFloat(e.target.value),
                })
              }
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              <Save size={18} />
            )}
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </div>

        {saved && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
            <CheckCircle size={18} /> Settings saved!
          </div>
        )}
      </form>
    </div>
  );
};

export default AdminSetting;
