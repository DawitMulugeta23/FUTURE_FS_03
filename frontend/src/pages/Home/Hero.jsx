import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1442512595331-e89e73853f31?ixlib=rb-4.0.3)',
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative text-center text-white px-4 z-10">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-playfair font-bold mb-4"
        >
          Welcome to <span className="text-coffee-400">Yesekela Cafe</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
        >
          Experience the finest coffee and authentic Ethiopian cuisine in a cozy atmosphere
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/menu"
            className="bg-coffee-500 hover:bg-coffee-600 text-white px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
          >
            View Menu
          </Link>
          <Link
            to="/reservations"
            className="bg-transparent border-2 border-white hover:bg-white hover:text-coffee-900 text-white px-8 py-3 rounded-full font-semibold transition-all"
          >
            Book a Table
          </Link>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;