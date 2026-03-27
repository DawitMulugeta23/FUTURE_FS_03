import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    text: 'The best coffee in town! The atmosphere is amazing and the staff is incredibly friendly.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Tekle',
    text: 'Authentic Ethiopian cuisine that tastes like home. The kitfo is absolutely delicious!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Davis',
    text: 'Love the cozy ambiance and the fresh pastries. Perfect spot for morning coffee or afternoon work.',
    rating: 4,
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-coffee-800 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our happy customers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 relative"
            >
              <FaQuoteLeft className="text-coffee-300 text-3xl mb-4" />
              <p className="text-gray-600 mb-4 italic">{testimonial.text}</p>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}
                    size={16}
                  />
                ))}
              </div>
              <h4 className="font-semibold text-coffee-800">{testimonial.name}</h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;