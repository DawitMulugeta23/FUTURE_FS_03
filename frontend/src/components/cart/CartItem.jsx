import React from 'react';
import { useDispatch } from 'react-redux';
import { FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { updateQuantity, removeFromCart } from '../../store/slices/cartSlice';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  return (
    <div className="flex gap-4 p-3 bg-gray-50 rounded-lg">
      <img
        src={item.image || 'https://via.placeholder.com/80'}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-coffee-500 font-semibold">${item.price.toFixed(2)}</p>
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
  );
};

export default CartItem;