// frontend/src/components/Admin/OrdersManager.jsx
import axios from "axios";
import {
  CheckCircle,
  Clock,
  Eye,
  Package,
  RefreshCw,
  Trash2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useTheme } from "../../context/useTheme";
import { showConfirm } from "../../utils/showConfirm";

const OrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("No authentication token found");
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data && response.data.success) {
        setOrders(response.data.data || []);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error(err.response?.data?.message || "Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
      toast.error(err.response?.data?.error || "Failed to update order status");
    }
  };

  // ✅ Updated delete order function with toast confirmation
  const deleteOrder = async (orderId, orderName = "") => {
    showConfirm(
      `Are you sure you want to delete order ${orderName ? `#${orderName}` : ""}? This action cannot be undone.`,
      async () => {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          toast.success("Order deleted successfully");
          fetchOrders(); // Refresh the list

          // Close modal if open
          if (showModal) {
            setShowModal(false);
            setSelectedOrder(null);
          }
        } catch (err) {
          console.error("Error deleting order:", err);
          toast.error(err.response?.data?.error || "Failed to delete order");
        }
      },
      () => {
        // Cancel callback - do nothing, just close
        console.log("Delete cancelled");
      },
      true, // Danger mode (red)
    );
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/orders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data && response.data.success) {
        setSelectedOrder(response.data.data);
        setShowModal(true);
      } else {
        toast.error("Failed to fetch order details");
      }
    } catch (err) {
      console.error("Error fetching order details:", err);
      toast.error("Failed to fetch order details");
    }
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock size={16} />;
      case "Preparing":
        return <Package size={16} />;
      case "Delivered":
        return <CheckCircle size={16} />;
      case "Cancelled":
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
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
    <>
      <div className="space-y-6">
        <div
          className={`rounded-2xl shadow p-6 transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <div className="flex justify-between items-center mb-6">
            <h3
              className={`text-2xl font-bold transition-colors duration-300 ${darkMode ? "text-white" : "text-gray-800"}`}
            >
              All Orders
            </h3>
            <button
              onClick={fetchOrders}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                darkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {orders.length === 0 ? (
            <div
              className={`text-center py-12 transition-colors duration-300 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              <Package size={48} className="mx-auto mb-4 opacity-50" />
              <p>No orders found.</p>
              <p className="text-sm mt-2">
                Orders will appear here once customers place them.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead
                  className={`transition-colors duration-300 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
                >
                  <tr>
                    <th
                      className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                    >
                      Order ID
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                    >
                      Customer
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                    >
                      Items
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                    >
                      Total
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                    >
                      Payment
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                    >
                      Status
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y transition-colors duration-300 ${darkMode ? "divide-gray-700" : "divide-gray-200"}`}
                >
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className={`transition-colors duration-300 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}
                    >
                      <td
                        className={`px-4 py-3 font-mono text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                      >
                        #{order._id?.slice(-6) || "N/A"}
                      </td>
                      <td
                        className={`px-4 py-3 font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                      >
                        {order.user?.name || "Guest"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          {order.orderItems?.slice(0, 2).map((item, idx) => (
                            <span
                              key={idx}
                              className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                            >
                              {item.quantity}x {item.name}
                            </span>
                          ))}
                          {order.orderItems?.length > 2 && (
                            <span
                              className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                            >
                              +{order.orderItems.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td
                        className={`px-4 py-3 font-bold ${darkMode ? "text-amber-400" : "text-amber-600"}`}
                      >
                        {order.totalPrice} ETB
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            order.isPaid
                              ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300"
                          }`}
                        >
                          {order.isPaid ? "Paid" : "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => viewOrderDetails(order._id)}
                            className="p-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded transition"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <select
                            value={order.status || "Pending"}
                            onChange={(e) =>
                              updateOrderStatus(order._id, e.target.value)
                            }
                            className={`px-2 py-1 border rounded text-sm transition-colors duration-300 ${
                              darkMode
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <button
                            onClick={() =>
                              deleteOrder(order._id, order._id?.slice(-6))
                            }
                            className="p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded transition"
                            title="Delete Order"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-white"}`}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3
                  className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
                >
                  Order Details
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className={`transition-colors duration-300 ${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`}
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p
                      className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Order ID
                    </p>
                    <p
                      className={`font-mono ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {selectedOrder._id}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Date
                    </p>
                    <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Customer
                    </p>
                    <p
                      className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                    >
                      {selectedOrder.user?.name || "Guest"}
                    </p>
                    <p
                      className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {selectedOrder.user?.email || "No email"}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Payment Status
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                        selectedOrder.isPaid
                          ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300"
                      }`}
                    >
                      {selectedOrder.isPaid ? "Paid" : "Pending"}
                    </span>
                  </div>
                </div>

                <div>
                  <p
                    className={`text-sm mb-2 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Order Items
                  </p>
                  <div className="space-y-2">
                    {selectedOrder.orderItems?.map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex justify-between items-center border-b pb-2 ${darkMode ? "border-gray-700" : "border-gray-200"}`}
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
                            {item.quantity} x {item.price} ETB
                          </p>
                        </div>
                        <p
                          className={`font-bold ${darkMode ? "text-amber-400" : "text-amber-600"}`}
                        >
                          {item.price * item.quantity} ETB
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className={`border-t pt-4 ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold">Total Amount</p>
                    <p
                      className={`text-2xl font-bold ${darkMode ? "text-amber-400" : "text-amber-600"}`}
                    >
                      {selectedOrder.totalPrice} ETB
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() =>
                      deleteOrder(
                        selectedOrder._id,
                        selectedOrder._id?.slice(-6),
                      )
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    <Trash2 size={18} />
                    Delete Order
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrdersManager;
