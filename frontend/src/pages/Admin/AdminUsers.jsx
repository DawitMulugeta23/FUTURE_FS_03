import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FiEdit2,
  FiMail,
  FiPhone,
  FiSearch,
  FiSend,
  FiTrash2,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";
import apiClient from "../../services/api/apiClient";

const initialEmailForm = {
  subject: "",
  message: "",
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState(null);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailForm, setEmailForm] = useState(initialEmailForm);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {};

      if (roleFilter !== "all") params.role = roleFilter;
      if (statusFilter === "active") params.isActive = true;
      if (statusFilter === "inactive") params.isActive = false;

      const response = await apiClient.get("/admin/users", { params });
      const nextUsers = response.data.data || [];

      setUsers(nextUsers);
      setSelectedUsers((prev) =>
        prev.filter((id) => nextUsers.some((user) => user._id === id)),
      );
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch users");
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  }, [roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return users;

    return users.filter((user) =>
      [user.name, user.email, user.phone]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [searchTerm, users]);

  const recipientCount =
    selectedUsers.length > 0 ? selectedUsers.length : filteredUsers.length;

  const updateUserRole = async (id, newRole) => {
    try {
      await apiClient.patch(`/admin/users/${id}/role`, { role: newRole });
      toast.success("User role updated");
      fetchUsers();
      setEditingUser(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await apiClient.delete(`/admin/users/${id}`);
        toast.success("User deleted");
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const toggleSelectAllFiltered = () => {
    const filteredIds = filteredUsers.map((user) => user._id);
    const allSelected =
      filteredIds.length > 0 &&
      filteredIds.every((id) => selectedUsers.includes(id));

    if (allSelected) {
      setSelectedUsers((prev) =>
        prev.filter((id) => !filteredIds.includes(id)),
      );
      return;
    }

    setSelectedUsers((prev) => [...new Set([...prev, ...filteredIds])]);
  };

  const openEmailModal = () => {
    if (recipientCount === 0) {
      toast.error("No users available for email");
      return;
    }

    setIsEmailModalOpen(true);
  };

  const closeEmailModal = () => {
    setIsEmailModalOpen(false);
    setEmailForm(initialEmailForm);
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();

    if (!emailForm.subject.trim() || !emailForm.message.trim()) {
      toast.error("Subject and message are required");
      return;
    }

    const userIds =
      selectedUsers.length > 0
        ? selectedUsers
        : filteredUsers.map((user) => user._id);

    if (userIds.length === 0) {
      toast.error("No recipients selected");
      return;
    }

    setIsSendingEmail(true);

    try {
      const response = await apiClient.post("/admin/users/email", {
        userIds,
        subject: emailForm.subject,
        message: emailForm.message,
      });

      toast.success(response.data.message || "Email sent successfully");
      setSelectedUsers([]);
      closeEmailModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send email");
    } finally {
      setIsSendingEmail(false);
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
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-playfair font-bold text-coffee-800">
            User Management
          </h2>
          <p className="text-gray-500">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-coffee-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-coffee-500"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="staff">Staff</option>
            <option value="customer">Customers</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-coffee-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            onClick={toggleSelectAllFiltered}
            className="px-4 py-2 rounded-lg border border-coffee-300 text-coffee-700 hover:bg-coffee-50"
          >
            {filteredUsers.length > 0 &&
            filteredUsers.every((user) => selectedUsers.includes(user._id))
              ? "Clear Filtered"
              : "Select Filtered"}
          </button>

          <button
            onClick={openEmailModal}
            className="px-4 py-2 rounded-lg bg-coffee-500 text-white hover:bg-coffee-600 flex items-center gap-2"
          >
            <FiSend size={16} />
            {selectedUsers.length > 0
              ? `Message Selected (${selectedUsers.length})`
              : `Message Filtered (${filteredUsers.length})`}
          </button>
        </div>
      </div>

      <div className="bg-coffee-50 border border-coffee-100 rounded-xl p-4 flex items-center gap-3 text-sm text-coffee-800">
        <FiUsers className="shrink-0" />
        <span>
          {selectedUsers.length > 0
            ? `${selectedUsers.length} user(s) selected for messaging.`
            : "No users selected. Messaging will use the currently filtered users."}
        </span>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-500">No users found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-coffee-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Select
                </th>
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
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => toggleUserSelection(user._id)}
                      className="h-4 w-4 accent-coffee-500"
                    />
                  </td>
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
                    <div className="flex flex-col gap-2">
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
                          className={`px-2 py-1 rounded-full text-xs font-medium capitalize w-fit ${getRoleColor(user.role)}`}
                        >
                          {user.role}
                        </span>
                      )}

                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${
                          user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
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
                            title="Edit role"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUsers([user._id]);
                              openEmailModal();
                            }}
                            className="text-coffee-500 hover:text-coffee-600"
                            title="Send email"
                          >
                            <FiMail size={18} />
                          </button>
                          {user.role !== "admin" && (
                            <button
                              onClick={() => deleteUser(user._id)}
                              className="text-red-500 hover:text-red-600"
                              title="Delete user"
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

      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between border-b p-6">
              <div>
                <h3 className="text-xl font-semibold text-coffee-800">
                  Send Email Message
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Sending to {recipientCount}{" "}
                  {recipientCount === 1 ? "user" : "users"}
                </p>
              </div>
              <button
                onClick={closeEmailModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={22} />
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) =>
                    setEmailForm((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  placeholder="Enter email subject"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-coffee-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={8}
                  value={emailForm.message}
                  onChange={(e) =>
                    setEmailForm((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  placeholder="Write your message to the selected or filtered users..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-coffee-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEmailModal}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingEmail}
                  className="px-4 py-2 rounded-lg bg-coffee-500 text-white hover:bg-coffee-600 disabled:opacity-70 flex items-center gap-2"
                >
                  <FiSend size={16} />
                  {isSendingEmail ? "Sending..." : "Send Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
