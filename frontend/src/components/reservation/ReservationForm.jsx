import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createReservation } from '../../store/slices/reservationSlice';
import toast from 'react-hot-toast';

const ReservationForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    specialRequests: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await dispatch(createReservation(formData)).unwrap();
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: 2,
        specialRequests: '',
      });
    } catch (error) {
      toast.error('Failed to make reservation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-coffee-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-coffee-500"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-coffee-500"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-coffee-500"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-coffee-500"
        />
        <input
          type="number"
          name="guests"
          placeholder="Number of Guests"
          value={formData.guests}
          onChange={handleChange}
          min="1"
          max="20"
          required
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-coffee-500"
        />
      </div>
      
      <textarea
        name="specialRequests"
        placeholder="Special Requests (allergies, preferences, etc.)"
        value={formData.specialRequests}
        onChange={handleChange}
        rows="3"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-coffee-500"
      />
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-coffee-500 hover:bg-coffee-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Making Reservation...' : 'Make Reservation'}
      </button>
    </form>
  );
};

export default ReservationForm;