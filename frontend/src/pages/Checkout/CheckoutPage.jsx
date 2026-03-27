import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createOrder } from '../../store/slices/orderSlice';
import { clearCart } from '../../store/slices/cartSlice';
import CartSummary from '../../components/cart/CartSummary';
import { FiCreditCard, FiDollarSign, FiSmartphone } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [specialInstructions, setSpecialInstructions] = useState('');

  if (items.length === 0) {
    navigate('/menu');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderData = {
      items: items.map(item => ({
        menuItem: item.menuItem,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions,
      })),
      paymentMethod,
      specialInstructions,
    };

    try {
      const result = await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate(`/orders`);
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentMethods = [
    { id: 'cash', name: 'Cash on Delivery', icon: FiDollarSign, description: 'Pay when you receive your order' },
    { id: 'card', name: 'Card Payment', icon: FiCreditCard, description: 'Pay with debit/credit card' },
    { id: 'online', name: 'Online Payment', icon: FiSmartphone, description: 'Pay via mobile money' },
  ];

  return (
    <div className="py-12 bg-coffee-50 min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-playfair font-bold text-coffee-800 mb-4">Checkout</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Complete your order
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.menuItem} className="flex justify-between py-2 border-b">
                    <div>
                      <span className="font-medium">{item.quantity}x</span>
                      <span className="ml-2">{item.name}</span>
                    </div>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? 'border-coffee-500 bg-coffee-50'
                        : 'border-gray-200 hover:border-coffee-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-4 text-coffee-500"
                    />
                    <method.icon className="text-2xl text-coffee-500 mr-3" />
                    <div>
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm text-gray-500">{method.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Special Instructions</h2>
              <textarea
                rows="3"
                placeholder="Any special requests? (allergies, preferences, etc.)"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-coffee-500"
              />
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {user?.name}</p>
                <p><span className="font-medium">Email:</span> {user?.email}</p>
                <p><span className="font-medium">Phone:</span> {user?.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>

          <div>
            <CartSummary />
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full mt-6 bg-coffee-500 hover:bg-coffee-600 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Placing Order...' : `Place Order - $${(totalAmount * 1.15).toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;