import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiMenu, 
  FiShoppingBag, 
  FiUsers, 
  FiCalendar, 
  FiStar, 
  FiSettings,
  FiBarChart2,
  FiLogOut
} from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin', name: 'Dashboard', icon: FiHome },
    { path: '/admin/menu', name: 'Menu Management', icon: FiMenu },
    { path: '/admin/orders', name: 'Orders', icon: FiShoppingBag },
    { path: '/admin/users', name: 'Users', icon: FiUsers },
    { path: '/admin/reservations', name: 'Reservations', icon: FiCalendar },
    { path: '/admin/reviews', name: 'Reviews', icon: FiStar },
    { path: '/admin/analytics', name: 'Analytics', icon: FiBarChart2 },
    { path: '/admin/settings', name: 'Settings', icon: FiSettings },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-coffee-900 text-white min-h-screen fixed left-0 top-0 pt-20">
      <div className="px-4 py-6">
        <div className="mb-8 text-center">
          <h2 className="text-xl font-playfair font-bold">Admin Panel</h2>
          <p className="text-coffee-300 text-sm">Yesekela Cafe</p>
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-coffee-700 text-coffee-300'
                    : 'hover:bg-coffee-800 text-gray-300'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-8 left-0 right-0 px-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full hover:bg-coffee-800 text-gray-300 transition-colors"
          >
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;