import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import ReservationForm from '../../components/reservation/ReservationForm';
import { Link } from 'react-router-dom';

const ReservationsPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="py-12 bg-coffee-50 min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-playfair font-bold text-coffee-800 mb-4">Make a Reservation</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Book your table in advance to ensure the perfect dining experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Reservation Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-playfair font-bold text-coffee-800 mb-6">Book Your Table</h2>
            {isAuthenticated ? (
              <ReservationForm />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Please login to make a reservation</p>
                <Link
                  to="/login"
                  className="inline-block bg-coffee-500 hover:bg-coffee-600 text-white px-6 py-2 rounded-full font-semibold transition-colors"
                >
                  Login to Book
                </Link>
              </div>
            )}
          </motion.div>

          {/* Information Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-playfair font-bold text-coffee-800 mb-4">Reservation Policy</h2>
              <ul className="space-y-3 text-gray-600">
                <li>• Reservations are held for 15 minutes after the reserved time</li>
                <li>• For parties of 6 or more, please call us directly</li>
                <li>• Cancellations must be made at least 2 hours in advance</li>
                <li>• Special dietary requests can be noted in the form</li>
                <li>• Private events and catering available upon request</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-playfair font-bold text-coffee-800 mb-4">Dining Hours</h2>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>8:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>9:00 AM - 11:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>9:00 AM - 9:00 PM</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReservationsPage;