import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CartDrawer = ({ isOpen, onClose }) => {
  const { items, totalQuantity, totalAmount } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      navigate('/login');
      onClose();
      return;
    }
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-playfair font-semibold">
                Your Cart ({totalQuantity} items)
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <FiX size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Your cart is empty</p>
                  <button
                    onClick={onClose}
                    className="mt-4 text-coffee-500 hover:text-coffee-600"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.menuItem} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.image || 'https://via.placeholder.com/80'}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-coffee-500 font-semibold">
                          ${item.price.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  id: item.menuItem,
                                  quantity: item.quantity - 1,
                                })
                              )
                            }
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <FiMinus size={16} />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  id: item.menuItem,
                                  quantity: item.quantity + 1,
                                })
                              )
                            }
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <FiPlus size={16} />
                          </button>
                          <button
                            onClick={() => dispatch(removeFromCart(item.menuItem))}
                            className="ml-auto text-red-500 hover:text-red-600"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t p-4 space-y-3">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span className="text-coffee-500 text-xl">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => dispatch(clearCart())}
                    className="flex-1 border border-red-500 text-red-500 py-2 rounded-full hover:bg-red-50 transition-colors"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="flex-1 bg-coffee-500 text-white py-2 rounded-full hover:bg-coffee-600 transition-colors"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;