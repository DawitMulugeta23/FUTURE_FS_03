import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { addToCart } from '../../store/slices/cartSlice';

const MenuCard = ({ item }) => {
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        menuItem: item._id,
        name: item.name,
        price: item.price,
        quantity: quantity,
        image: item.image,
      })
    );
    setQuantity(1);
  };

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image || 'https://via.placeholder.com/300'}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        {item.isSpecial && (
          <span className="absolute top-3 left-3 bg-coffee-500 text-white text-xs px-2 py-1 rounded-full">
            Special
          </span>
        )}
        {item.isVegetarian && (
          <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            Veg
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
          <button className="text-gray-400 hover:text-red-500 transition-colors">
            <FiHeart size={20} />
          </button>
        </div>
        
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-coffee-500">
              ${item.price.toFixed(2)}
            </span>
            <span className="text-gray-400 text-sm">ETB</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
              >
                -
              </button>
              <span className="w-8 text-center text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="bg-coffee-500 hover:bg-coffee-600 text-white p-2 rounded-lg transition-colors"
            >
              <FiShoppingCart size={18} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuCard;