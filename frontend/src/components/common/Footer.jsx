import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-coffee-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-playfair font-bold mb-4">Yesekela Cafe</h3>
            <p className="text-gray-300">
              Experience the finest coffee and authentic Ethiopian cuisine in a cozy atmosphere.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/menu" className="hover:text-coffee-400">Menu</Link></li>
              <li><Link to="/about" className="hover:text-coffee-400">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-coffee-400">Contact</Link></li>
              <li><Link to="/reservations" className="hover:text-coffee-400">Reservations</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-gray-300">
              <li>📍 Addis Ababa, Ethiopia</li>
              <li>📞 +251 123 456 789</li>
              <li>✉️ info@yesekelacafe.com</li>
              <li>⏰ Mon-Sun: 8:00 AM - 10:00 PM</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-coffee-400 text-2xl transition-colors">
                <FaFacebook />
              </a>
              <a href="#" className="text-gray-300 hover:text-coffee-400 text-2xl transition-colors">
                <FaInstagram />
              </a>
              <a href="#" className="text-gray-300 hover:text-coffee-400 text-2xl transition-colors">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-300 hover:text-coffee-400 text-2xl transition-colors">
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Yesekela Cafe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;