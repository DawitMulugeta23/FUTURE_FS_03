import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import MenuCard from '../../components/menu/MenuCard';
import MenuFilter from '../../components/menu/MenuFilter';
import MenuSearch from '../../components/menu/MenuSearch';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MenuPage = () => {
  const { items, isLoading } = useSelector((state) => state.menu);
  const [activeCategory, setActiveCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    let filtered = items;
    
    if (activeCategory) {
      filtered = filtered.filter(item => item.category?.name === activeCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [items, activeCategory, searchTerm]);

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
          <h1 className="text-5xl font-playfair font-bold text-coffee-800 mb-4">Our Menu</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our carefully crafted selection of coffee, tea, pastries, and authentic Ethiopian dishes
          </p>
        </motion.div>

        <MenuSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <MenuFilter activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <MenuCard item={item} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;