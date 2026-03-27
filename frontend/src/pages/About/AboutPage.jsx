import React from 'react';
import { motion } from 'framer-motion';
import { FaCoffee, FaHeart, FaLeaf, FaUsers } from 'react-icons/fa';

const AboutPage = () => {
  const values = [
    { icon: FaCoffee, title: 'Quality Coffee', description: 'We source the finest beans from Ethiopian highlands' },
    { icon: FaHeart, title: 'Passion for Food', description: 'Every dish is made with love and authentic recipes' },
    { icon: FaLeaf, title: 'Fresh Ingredients', description: 'We use locally sourced, fresh ingredients daily' },
    { icon: FaUsers, title: 'Community', description: 'Creating a welcoming space for everyone' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3)',
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-playfair font-bold mb-4">About Us</h1>
          <p className="text-xl max-w-2xl mx-auto">Discover the story behind Yesekela Cafe</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-playfair font-bold text-coffee-800 mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Yesekela Cafe was founded with a simple mission: to bring the authentic taste of Ethiopian coffee and cuisine to our community.
              </p>
              <p className="text-gray-600 mb-4">
                Our name "Yesekela" means "gift" in Amharic, reflecting our belief that every cup of coffee and every meal we serve is a gift to be shared.
              </p>
              <p className="text-gray-600">
                From our carefully roasted coffee beans to our traditional recipes passed down through generations, we take pride in delivering an authentic Ethiopian experience.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden shadow-xl"
            >
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3"
                alt="Coffee preparation"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-coffee-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold text-coffee-800 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">What makes Yesekela Cafe special</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <value.icon className="text-coffee-500 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;