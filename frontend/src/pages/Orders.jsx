import axios from "axios";
import { Calendar, CheckCircle, Clock, Coffee } from "lucide-react";
import { useEffect, useState } from "react";
const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchMyOrders = async () => {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        "http://localhost:5000/api/orders/myorders",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setOrders(data.data);
    };
    fetchMyOrders();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-amber-900 flex items-center gap-3">
        <Coffee className="text-amber-600" /> My Order History
      </h2>

      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl text-center shadow">
          <p className="text-gray-500">
            You haven&apos;t ordered anything yet. Time for a coffee?
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-amber-600 flex flex-col md:flex-row justify-between items-center"
            >
              <div>
                <p className="text-sm text-gray-400 font-mono">
                  ID: #{order._id.slice(-6)}
                </p>
                <div className="flex items-center gap-2 text-gray-700 mt-1">
                  <Calendar size={16} />
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="mt-2">
                  {order.orderItems.map((item, index) => (
                    <span
                      key={index}
                      className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-md mr-2"
                    >
                      {item.qty}x {item.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-right mt-4 md:mt-0">
                <p className="text-xl font-bold text-gray-800">
                  {order.totalPrice} ETB
                </p>
                <div
                  className={`flex items-center gap-1 justify-end font-bold mt-1 ${order.isPaid ? "text-green-600" : "text-yellow-600"}`}
                >
                  {order.isPaid ? (
                    <CheckCircle size={16} />
                  ) : (
                    <Clock size={16} />
                  )}
                  <span>{order.isPaid ? "Paid" : "Pending"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
