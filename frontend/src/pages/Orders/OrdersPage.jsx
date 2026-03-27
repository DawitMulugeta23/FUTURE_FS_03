import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchMyOrders, cancelOrder } from '../../store/slices/orderSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { format } from 'date-fns';
import { FiClock, FiCheckCircle, FiXCircle, FiPackage } from 'react-icons/fi';

const OrdersPage = () => {
  const { orders, isLoading } = useSelector((state) => state.orders);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, isAuthenticated]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        return <FiClock className="text-yellow-500" />;
      case 'preparing':
      case 'ready':
        return <FiPackage className="text-blue-500" />;
      case 'delivered':
        return <FiCheckCircle className="text-green-500" />;
      case 'cancelled':
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-purple-100 text-purple-800';
      case 'ready':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-600">Please login to view your orders</p>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="py-12 bg-coffee-50 min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-playfair font-bold text-coffee-800 mb-4">My Orders</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Track and manage your orders
          </p>
        </motion.div>

        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <p className="text-gray-500 text-lg">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex flex-wrap justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order #{order._id.slice(-8)}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(order.createdAt), 'MMM dd, yyyy - hh:mm a')}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </div>
                </div>

                <div className="border-t border-b py-4 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-2">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium capitalize">{order.paymentMethod}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-xl font-bold text-coffee-500">${order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                {order.status === 'pending' && (
                  <button
                    onClick={() => dispatch(cancelOrder(order._id))}
                    className="mt-4 text-red-500 hover:text-red-600 text-sm font-medium"
                  >
                    Cancel Order
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;