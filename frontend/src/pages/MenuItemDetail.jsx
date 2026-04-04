// frontend/src/pages/MenuItemDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, 
  Minus, 
  Plus, 
  ShoppingCart, 
  Coffee,
  Clock,
  Tag,
  Package,
  Star,
  Truck,
  Heart,
  Share2,
  CheckCircle
} from "lucide-react";
import { useCart } from "../context/useCart";
import { toast } from "react-hot-toast";

const MenuItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [isAdded, setIsAdded] = useState(false);

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
    if (item && quantity < item.quantity) {
      setQuantity(prev => prev + 1);
    } else {
      toast.error(`Only ${item?.quantity} items available`);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Coffee: "bg-amber-100 text-amber-800",
      Pastry: "bg-orange-100 text-orange-800",
      Meal: "bg-green-100 text-green-800",
      Drink: "bg-blue-100 text-blue-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading delicious details...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="text-center">
          <Coffee size={64} className="mx-auto text-amber-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Item Not Found</h2>
          <p className="text-gray-600 mb-6">The menu item you're looking for doesn't exist.</p>
          <Link to="/menu" className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700">
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = item.quantity === 0;
  const cartItem = cartItems.find(i => i._id === item._id);
  const cartQuantity = cartItem?.qty || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-amber-600 transition mb-6 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition" />
          Back to Menu
        </button>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
              <img
                src={activeImage}
                alt={item.name}
                className="w-full h-96 object-cover hover:scale-105 transition duration-500"
              />
            </div>
            {item.gallery && item.gallery.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                <img
                  src={item.image}
                  alt={item.name}
                  onClick={() => setActiveImage(item.image)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer transition border-2 ${activeImage === item.image ? 'border-amber-500' : 'border-transparent'}`}
                />
                {item.gallery?.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${item.name} ${idx + 1}`}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer transition border-2 ${activeImage === img ? 'border-amber-500' : 'border-transparent'}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(item.category)}`}>
                {item.category}
              </span>
              {item.isAvailable && !isOutOfStock && (
                <span className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
                  <CheckCircle size={14} /> In Stock
                </span>
              )}
              {isOutOfStock && (
                <span className="flex items-center gap-1 text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">{item.name}</h1>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-amber-600">{item.price} ETB</span>
              {item.oldPrice && (
                <span className="text-lg text-gray-400 line-through">{item.oldPrice} ETB</span>
              )}
            </div>

            {/* Description */}
            <div className="border-t border-b py-4">
              <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                <Package size={20} className="text-amber-600" />
                <div>
                  <p className="text-xs text-gray-500">Available Quantity</p>
                  <p className="font-semibold text-gray-800">{item.quantity} items</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                <Clock size={20} className="text-amber-600" />
                <div>
                  <p className="text-xs text-gray-500">Prep Time</p>
                  <p className="font-semibold text-gray-800">10-15 mins</p>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="space-y-4">
                <label className="font-semibold text-gray-800">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= item.quantity}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <Plus size={20} />
                  </button>
                  <span className="text-sm text-gray-500">
                    {item.quantity} available
                  </span>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition transform hover:scale-105 ${
                  isOutOfStock
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : isAdded
                    ? "bg-green-600 text-white"
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
                    <ShoppingCart size={22} /> Add to Cart - {(item.price * quantity).toFixed(2)} ETB
                  </>
                )}
              </button>

              {cartQuantity > 0 && (
                <p className="text-center text-sm text-amber-600">
                  You have {cartQuantity} in your cart
                </p>
              )}
            </div>

            {/* Additional Info */}
            <div className="bg-amber-50 rounded-xl p-4 space-y-2">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                <Truck size={18} className="text-amber-600" />
                Delivery Information
              </h4>
              <p className="text-sm text-gray-600">
                • Free delivery on orders over 500 ETB within Debre Berhan<br />
                • Estimated delivery time: 30-45 minutes<br />
                • Pickup available at our café location
              </p>
            </div>

            {/* Share Buttons */}
            <div className="flex gap-3 pt-4">
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition">
                <Heart size={18} className="text-red-500" /> Save
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition">
                <Share2 size={18} className="text-blue-500" /> Share
              </button>
            </div>
          </div>
        </div>

        {/* Related Items Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* You can add related items here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemDetail;