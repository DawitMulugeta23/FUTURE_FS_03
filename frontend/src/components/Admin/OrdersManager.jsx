import axios from "axios";
import { CheckCircle, Clock, Package, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const OrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-700",
      Preparing: "bg-blue-100 text-blue-700",
      Ready: "bg-green-100 text-green-700",
      Delivered: "bg-purple-100 text-purple-700",
      Cancelled: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock size={16} />;
      case "Preparing":
        return <Package size={16} />;
      case "Ready":
        return <CheckCircle size={16} />;
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
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">All Orders</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Payment
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-mono text-sm">
                    #{order._id.slice(-6)}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {order.user?.name || "Guest"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {order.orderItems?.map((item, idx) => (
                        <span key={idx} className="text-sm">
                          {item.quantity || item.qty}x {item.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-amber-900">
                    {order.totalPrice} ETB
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        order.isPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
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
                    <select
                      value={order.status || "Pending"}
                      onChange={(e) =>
                        updateOrderStatus(order._id, e.target.value)
                      }
                      className="px-2 py-1 border rounded text-sm bg-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Ready">Ready</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-8 text-gray-500">No orders found</div>
        )}
      </div>
    </div>
  );
};

export default OrdersManager;
