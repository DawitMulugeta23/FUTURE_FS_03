// frontend/src/components/Admin/UserManager.jsx
import axios from "axios";
import { Mail, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTheme } from "../../context/useTheme";

const UsersManager = () => {
  const { darkMode } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [emailData, setEmailData] = useState({ subject: "", message: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setUsers(data.users);
    } catch (err) {
      console.error("Error fetching users", err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("User role updated");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update role");
      console.error("Error updating user role", err);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("User deleted");
        fetchUsers();
      } catch (err) {
        toast.error("Failed to delete user");
        console.error("Error deleting user", err);
      }
    }
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/admin/send-email",
        {
          userId: selectedUser._id,
          subject: emailData.subject,
          message: emailData.message,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Email sent successfully");
      setShowEmailModal(false);
      setEmailData({ subject: "", message: "" });
    } catch (err) {
      toast.error("Failed to send email");
      console.error("Error sending email", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 dark:border-amber-500"></div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl shadow p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
    >
      <h3
        className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}
      >
        User Management
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
            <tr>
              <th
                className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                Name
              </th>
              <th
                className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                Email
              </th>
              <th
                className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                Role
              </th>
              <th
                className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                Joined
              </th>
              <th
                className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody
            className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"}`}
          >
            {users.map((user) => (
              <tr
                key={user._id}
                className={`transition ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}
              >
                <td
                  className={`px-4 py-3 font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                >
                  {user.name}
                </td>
                <td
                  className={`px-4 py-3 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  {user.email}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user._id, e.target.value)}
                    className={`px-2 py-1 border rounded text-sm ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="user">User</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td
                  className={`px-4 py-3 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowEmailModal(true);
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded transition"
                      title="Send Email"
                    >
                      <Mail size={18} />
                    </button>
                    {user.role !== "admin" && (
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded transition"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`rounded-2xl p-6 max-w-md w-full mx-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}
          >
            <h3
              className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}
            >
              Send Email to {selectedUser?.name}
            </h3>
            <form onSubmit={sendEmail}>
              <div className="mb-4">
                <label
                  className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Subject
                </label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) =>
                    setEmailData({ ...emailData, subject: e.target.value })
                  }
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Message
                </label>
                <textarea
                  rows={4}
                  value={emailData.message}
                  onChange={(e) =>
                    setEmailData({ ...emailData, message: e.target.value })
                  }
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition"
                >
                  Send Email
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className={`flex-1 border py-2 rounded-lg transition ${
                    darkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManager;
