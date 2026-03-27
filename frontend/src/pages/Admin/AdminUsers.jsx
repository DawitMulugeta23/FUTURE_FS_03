import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEdit2, FiMail, FiPhone, FiTrash2, FiUser } from "react-icons/fi";
import apiClient from "../../services/api/apiClient";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    console.log("Fetching users...");

    try {
      const token = localStorage.getItem("token");
      console.log("Token exists:", !!token);

      const response = await apiClient.get("/admin/users");
      console.log("Users response:", response.data);

      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Fetch users error:", error);
      console.error("Error response:", error.response);
      console.error("Error status:", error.response?.status);
      console.error("Error message:", error.response?.data?.message);

      setError(error.response?.data?.message || "Failed to fetch users");
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (id, newRole) => {
    try {
      await apiClient.patch(`/admin/users/${id}/role`, { role: newRole });
      toast.success("User role updated");
      fetchUsers();
      setEditingUser(null);
    } catch (error) {
      toast.error("Failed to update role");
      console.error("Update user role error:", error);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await apiClient.delete(`/admin/users/${id}`);
        toast.success("User deleted");
        fetchUsers();
      } catch (error) {
        toast.error("Failed to delete user");
        console.error("Delete user error:", error);
      }
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: "bg-purple-100 text-purple-800",
      staff: "bg-blue-100 text-blue-800",
      customer: "bg-green-100 text-green-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <h3 className="text-lg font-semibold text-red-600 mb-2">
          Error Loading Users
        </h3>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={fetchUsers}
          className="mt-4 px-4 py-2 bg-coffee-500 text-white rounded-lg hover:bg-coffee-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-playfair font-bold text-coffee-800">
          User Management
        </h2>
        <p className="text-gray-500">Total Users: {users.length}</p>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-500">No users found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-coffee-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  User
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-coffee-100 rounded-full flex items-center justify-center">
                        <FiUser className="text-coffee-500" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">
                          ID: {user._id.slice(-6)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm flex items-center gap-1">
                        <FiMail size={14} /> {user.email}
                      </p>
                      {user.phone && (
                        <p className="text-sm flex items-center gap-1">
                          <FiPhone size={14} /> {user.phone}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {editingUser === user._id ? (
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="px-2 py-1 border rounded text-sm"
                      >
                        <option value="customer">Customer</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(user.role)}`}
                      >
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {editingUser === user._id ? (
                        <>
                          <button
                            onClick={() =>
                              updateUserRole(user._id, selectedRole)
                            }
                            className="text-green-500 hover:text-green-600 text-sm font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="text-gray-500 hover:text-gray-600 text-sm font-medium"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingUser(user._id);
                              setSelectedRole(user.role);
                            }}
                            className="text-blue-500 hover:text-blue-600"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          {user.role !== "admin" && (
                            <button
                              onClick={() => deleteUser(user._id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
