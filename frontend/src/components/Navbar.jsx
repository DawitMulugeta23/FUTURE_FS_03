import { useState } from "react";
import { Coffee, ShoppingCart, User, LogOut, ChevronDown, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext"; // ✅ Only one import now

const Navbar = () => {
  const { cartItems } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const itemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-amber-900 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Left Side: Logo */}
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <Coffee size={28} className="text-amber-400" />
          <span>Yesekela Café</span>
        </Link>

        {/* Right Side: Navigation Links */}
        <div className="flex gap-6 items-center">
          <Link to="/menu" className="hover:text-amber-400 transition font-medium">
            Menu
          </Link>

          {/* Conditional Auth Section with Dropdown */}
          {userInfo ? (
            <div className="relative border-l border-amber-800 pl-4">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-amber-600 transition"
              >
                <User size={14} /> 
                {userInfo.name.split(" ")[0]}
                <ChevronDown size={12} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100">
                  <Link 
                    to="/myorders" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-amber-50 transition text-sm"
                  >
                    <ClipboardList size={16} /> My Orders
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition text-sm text-left"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hover:text-amber-400 transition font-medium">
              Login
            </Link>
          )}

          {/* Cart Icon */}
          <Link to="/cart" className="relative p-2 bg-amber-800 rounded-full hover:bg-amber-700 transition">
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;