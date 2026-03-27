import React, { useState } from 'react';

const categories = ['All', 'Coffee', 'Tea', 'Pastries', 'Sandwiches', 'Specials'];

const MenuFilter = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-8">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category === 'All' ? '' : category)}
          className={`px-6 py-2 rounded-full font-medium transition-all ${
            activeCategory === (category === 'All' ? '' : category)
              ? 'bg-coffee-500 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-coffee-100'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default MenuFilter;