import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import MenuCard from '../../components/menu/MenuCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const FeaturedMenu = () => {
  const { specials, isLoading } = useSelector((state) => state.menu);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="py-20 bg-coffee-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-coffee-800 mb-4">
            Today's Specials
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our chef's special creations, made with fresh ingredients and love
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specials?.slice(0, 3).map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <MenuCard item={item} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/menu"
            className="inline-block border-2 border-coffee-500 text-coffee-500 hover:bg-coffee-500 hover:text-white px-8 py-3 rounded-full font-semibold transition-all"
          >
            View Full Menu
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMenu;