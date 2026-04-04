// frontend/src/pages/MenuItemDetail.jsx
import axios from "axios";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Coffee,
  Edit,
  Heart,
  Minus,
  Package,
  Plus,
  Share2,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/useCart";
import { useTheme } from "../context/useTheme";

const MenuItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const { darkMode } = useTheme();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [isAdded, setIsAdded] = useState(false);

  // Check if user is admin
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const isAdmin = userInfo?.role === "admin";

  useEffect(() => {
    fetchMenuItem();
  }, [id]);

  const fetchMenuItem = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/food/${id}`);
      setItem(data.data);
      setActiveImage(data.data.image);
    } catch (error) {
      console.error("Error fetching menu item:", error);
      toast.error("Menu item not found");
      navigate("/menu");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!item) return;

    if (isAdmin) {
      toast.error("Admins cannot place orders. Please use a customer account.");
      return;
    }

    const maxQuantity = item.quantity;
    if (maxQuantity === 0) {
      toast.error(`${item.name} is out of stock!`);
      return;
    }

    if (quantity > maxQuantity) {
      toast.error(`Only ${maxQuantity} ${item.name} available in stock!`);
      return;
    }

    addToCart(item, quantity);
    setIsAdded(true);
    toast.success(`${quantity} x ${item.name} added to cart!`, {
      icon: "☕",
      duration: 2000,
    });

    setTimeout(() => setIsAdded(false), 2000);
  };

  const increaseQuantity = () => {
    if (isAdmin) {
      toast.error("Admins cannot place orders.");
      return;
    }
    if (item && quantity < item.quantity) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.error(`Only ${item?.quantity} items available`);
    }
  };

  const decreaseQuantity = () => {
    if (isAdmin) {
      toast.error("Admins cannot place orders.");
      return;
    }
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleEditItem = () => {
    navigate(`/admin/menu/edit/${item._id}`);
  };

  const getCategoryColor = (category) => {
    const colors = {
      Coffee:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
      Pastry:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300",
      Meal: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
      Drink: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    };
    return (
      colors[category] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    );
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
          darkMode
            ? "bg-gray-900"
            : "bg-gradient-to-br from-amber-50 via-white to-orange-50"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 dark:border-amber-500 mx-auto mb-4"></div>
          <p
            className={`transition-colors duration-300 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Loading delicious details...
          </p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
          darkMode
            ? "bg-gray-900"
            : "bg-gradient-to-br from-amber-50 via-white to-orange-50"
        }`}
      >
        <div className="text-center">
          <Coffee
            size={64}
            className={`mx-auto mb-4 ${darkMode ? "text-amber-500" : "text-amber-400"}`}
          />
          <h2
            className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Item Not Found
          </h2>
          <p
            className={`mb-6 transition-colors duration-300 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            The menu item you're looking for doesn't exist.
          </p>
          <Link
            to="/menu"
            className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = item.quantity === 0;
  const cartItem = cartItems.find((i) => i._id === item._id);
  const cartQuantity = cartItem?.qty || 0;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-amber-50 via-white to-orange-50"
      }`}
    >
      <div className="container mx-auto px-4 max-w-6xl py-8">
        {/* Back Button and Edit Button Row */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 transition-colors duration-300 group ${
              darkMode
                ? "text-gray-400 hover:text-amber-400"
                : "text-gray-600 hover:text-amber-600"
            }`}
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition"
            />
            Back to Menu
          </button>

          {/* Edit Button - Only visible for admin */}
          {isAdmin && (
            <button
              onClick={handleEditItem}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Edit size={18} />
              Edit Item
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div
              className={`rounded-2xl overflow-hidden shadow-xl transition-colors duration-300 ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <img
                src={activeImage}
                alt={item.name}
                className="w-full h-96 object-cover hover:scale-105 transition duration-500"
              />
            </div>
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(item.category)}`}
              >
                {item.category}
              </span>
              {item.isAvailable && !isOutOfStock && (
                <span className="flex items-center gap-1 text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-sm">
                  <CheckCircle size={14} /> In Stock
                </span>
              )}
              {isOutOfStock && (
                <span className="flex items-center gap-1 text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 rounded-full text-sm">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Title */}
            <h1
              className={`text-4xl md:text-5xl font-bold transition-colors duration-300 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {item.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-amber-600 dark:text-amber-500">
                {item.price} ETB
              </span>
            </div>

            {/* Description */}
            <div
              className={`border-t border-b py-4 transition-colors duration-300 ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <h3
                className={`font-semibold mb-2 transition-colors duration-300 ${
                  darkMode ? "text-gray-300" : "text-gray-800"
                }`}
              >
                Description
              </h3>
              <p
                className={`leading-relaxed transition-colors duration-300 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {item.description}
              </p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors duration-300 ${
                  darkMode ? "bg-gray-800" : "bg-amber-50"
                }`}
              >
                <Package
                  size={20}
                  className="text-amber-600 dark:text-amber-500"
                />
                <div>
                  <p
                    className={`text-xs transition-colors duration-300 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Available Quantity
                  </p>
                  <p
                    className={`font-semibold transition-colors duration-300 ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {item.quantity} items
                  </p>
                </div>
              </div>
              <div
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors duration-300 ${
                  darkMode ? "bg-gray-800" : "bg-amber-50"
                }`}
              >
                <Clock
                  size={20}
                  className="text-amber-600 dark:text-amber-500"
                />
                <div>
                  <p
                    className={`text-xs transition-colors duration-300 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Prep Time
                  </p>
                  <p
                    className={`font-semibold transition-colors duration-300 ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    10-15 mins
                  </p>
                </div>
              </div>
            </div>

            {/* Quantity Selector and Add to Cart - Only for non-admin */}
            {!isAdmin && !isOutOfStock && (
              <div className="space-y-4">
                <label
                  className={`font-semibold transition-colors duration-300 ${
                    darkMode ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className={`p-2 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed ${
                      darkMode
                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    <Minus size={20} />
                  </button>
                  <span
                    className={`text-2xl font-bold w-12 text-center transition-colors duration-300 ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= item.quantity}
                    className={`p-2 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed ${
                      darkMode
                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    <Plus size={20} />
                  </button>
                  <span
                    className={`text-sm transition-colors duration-300 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {item.quantity} available
                  </span>
                </div>
              </div>
            )}

            {/* Add to Cart Button - Only for non-admin */}
            {!isAdmin && (
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition transform hover:scale-105 disabled:transform-none ${
                    isOutOfStock
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                      : isAdded
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-amber-600 text-white hover:bg-amber-700"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <CheckCircle size={22} /> Added to Cart!
                    </>
                  ) : isOutOfStock ? (
                    "Out of Stock"
                  ) : (
                    <>
                      <ShoppingCart size={22} /> Add to Cart -{" "}
                      {(item.price * quantity).toFixed(2)} ETB
                    </>
                  )}
                </button>

                {cartQuantity > 0 && (
                  <p className="text-center text-sm text-amber-600 dark:text-amber-400">
                    You have {cartQuantity} in your cart
                  </p>
                )}
              </div>
            )}

            {/* Delivery Information */}
            <div
              className={`rounded-xl p-4 space-y-2 transition-colors duration-300 ${
                darkMode ? "bg-gray-800" : "bg-amber-50"
              }`}
            >
              <h4
                className={`font-semibold flex items-center gap-2 transition-colors duration-300 ${
                  darkMode ? "text-gray-300" : "text-gray-800"
                }`}
              >
                <Truck
                  size={18}
                  className="text-amber-600 dark:text-amber-500"
                />
                Delivery Information
              </h4>
              <p
                className={`text-sm transition-colors duration-300 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                • Free delivery on orders over 500 ETB within Debre Berhan
                <br />
                • Estimated delivery time: 30-45 minutes
                <br />• Pickup available at our café location
              </p>
            </div>

            {/* Share Buttons - Only for non-admin */}
            {!isAdmin && (
              <div className="flex gap-3 pt-4">
                <button
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition ${
                    darkMode
                      ? "border-gray-700 text-gray-400 hover:bg-gray-800"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Heart size={18} className="text-red-500" /> Save
                </button>
                <button
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition ${
                    darkMode
                      ? "border-gray-700 text-gray-400 hover:bg-gray-800"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Share2 size={18} className="text-blue-500" /> Share
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemDetail;
