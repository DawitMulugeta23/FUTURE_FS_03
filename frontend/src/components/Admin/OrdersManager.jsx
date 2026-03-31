import axios from "axios";
import { CheckCircle, Clock, Eye, Package, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTheme } from "../../context/useTheme";

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
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data.data);
    } catch (err) {
      console.error("Error fetching orders", err);
      toast.error("Failed to fetch orders");
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
      toast.success("Order status updated");
      fetchOrders();
    } catch (err) {
      toast.error("Failed to update order status");
      console.error("Error updating order status", err);
    }
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `http://localhost:5000/api/orders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setSelectedOrder(data.data);
      setShowModal(true);
    } catch (err) {
      toast.error("Failed to fetch order details");
      console.error("Error fetching order details", err);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
      Preparing:
        "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      Delivered:
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      Cancelled: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div
          className={`rounded-2xl shadow p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <h3
            className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}
          >
            All Orders
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Items
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Payment
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="px-4 py-3 font-mono text-sm">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {order.user?.name || "Guest"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {order.orderItems?.slice(0, 2).map((item, idx) => (
                          <span key={idx} className="text-sm">
                            {item.quantity}x {item.name}
                          </span>
                        ))}
                        {order.orderItems?.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{order.orderItems.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-amber-600">
                      {order.totalPrice} ETB
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          order.isPaid
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
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
                          className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <select
                          value={order.status || "Pending"}
                          onChange={(e) =>
                            updateOrderStatus(order._id, e.target.value)
                          }
                          className={`px-2 py-1 border rounded text-sm ${darkMode ? "bg-gray-700 text-white" : "bg-white"}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No orders found
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto ${darkMode ? "bg-gray-800" : "bg-white"}`}
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
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-mono">#{selectedOrder._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p>{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-medium">{selectedOrder.user?.name}</p>
                    <p className="text-sm text-gray-500">
                      {selectedOrder.user?.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                        selectedOrder.isPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {selectedOrder.isPaid ? "Paid" : "Pending"}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Items</p>
                  <div className="space-y-2">
                    {selectedOrder.orderItems?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center border-b pb-2"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold">
                          {item.price * item.quantity} ETB
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold">Total</p>
                    <p className="text-2xl font-bold text-amber-600">
                      {selectedOrder.totalPrice} ETB
                    </p>
                  </div>
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
