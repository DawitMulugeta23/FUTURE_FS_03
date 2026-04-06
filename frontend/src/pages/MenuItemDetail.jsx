// frontend/src/pages/MenuItemDetail.jsx
import axios from "axios";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Coffee,
  Edit,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Star,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/useCart";
import { useTheme } from "../context/useTheme";
import FoodCard from "../pages/FoodCard";

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
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  // Rating and like states
  const [userRating, setUserRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingReview, setRatingReview] = useState("");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [isTogglingLike, setIsTogglingLike] = useState(false);

  // Check if user is logged in and admin
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const isLoggedIn = !!userInfo;
  const isAdmin = userInfo?.role === "admin";

  const canAddToCart = isLoggedIn && !isAdmin;

  useEffect(() => {
    fetchMenuItem();
    fetchRelatedProducts();
  }, [id]);

  const fetchMenuItem = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const { data } = await axios.get(
        `http://localhost:5000/api/food/${id}`,
        config,
      );
      setItem(data.data);
      setActiveImage(data.data.image);
      setIsLiked(data.userLiked || false);
      setIsDisliked(data.userDisliked || false);
      setLikeCount(data.data.likeCount || 0);
      setDislikeCount(data.data.dislikeCount || 0);
      setAverageRating(data.data.averageRating || 0);
      setTotalRatings(data.data.totalRatings || 0);
      setUserRating(data.userRating || null);
    } catch (error) {
      console.error("Error fetching menu item:", error);
      toast.error("Menu item not found");
      navigate("/menu");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const { data } = await axios.get(
        `http://localhost:5000/api/food/${id}/related`,
        config,
      );
      setRelatedProducts(data.data);
    } catch (error) {
      console.error("Error fetching related products:", error);
    } finally {
      setLoadingRelated(false);
    }
  };

  const handleAddToCart = () => {
    if (!item) return;

    if (!isLoggedIn) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

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
    if (!isLoggedIn) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
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
    if (!isLoggedIn) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
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

  // Handle like
  const handleLike = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to like items");
      navigate("/login");
      return;
    }

    if (isAdmin) {
      toast.error("Admin accounts cannot like items");
      return;
    }

    setIsTogglingLike(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/food/${item._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        setIsLiked(!isLiked);
        if (!isLiked && isDisliked) setIsDisliked(false);
        setLikeCount(response.data.data.likeCount);
        setDislikeCount(response.data.data.dislikeCount);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Like error:", error);
      toast.error("Failed to update like");
    } finally {
      setIsTogglingLike(false);
    }
  };

  // Handle dislike
  const handleDislike = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to dislike items");
      navigate("/login");
      return;
    }

    if (isAdmin) {
      toast.error("Admin accounts cannot dislike items");
      return;
    }

    setIsTogglingLike(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/food/${item._id}/dislike`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        setIsDisliked(!isDisliked);
        if (!isDisliked && isLiked) setIsLiked(false);
        setLikeCount(response.data.data.likeCount);
        setDislikeCount(response.data.data.dislikeCount);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Dislike error:", error);
      toast.error("Failed to update dislike");
    } finally {
      setIsTogglingLike(false);
    }
  };

  // Handle rating submission
  const handleSubmitRating = async () => {
    if (!userRating && hoverRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    const finalRating = userRating || hoverRating;

    setIsSubmittingRating(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/food/${item._id}/rate`,
        { rating: finalRating, review: ratingReview },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        setAverageRating(response.data.data.averageRating);
        setTotalRatings(response.data.data.totalRatings);
        setUserRating(finalRating);
        toast.success(response.data.message);
        setShowRatingModal(false);
        setRatingReview("");
        setHoverRating(0);
      }
    } catch (error) {
      console.error("Rating error:", error);
      toast.error("Failed to submit rating");
    } finally {
      setIsSubmittingRating(false);
    }
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

  // Render stars for display
  const renderStars = (rating, size = 16) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            size={size}
            className="fill-yellow-400 text-yellow-400"
          />
        ))}
        {hasHalfStar && (
          <Star
            size={size}
            className="fill-yellow-400 text-yellow-400 opacity-50"
          />
        )}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star
            key={`empty-${i}`}
            size={size}
            className="text-gray-300 dark:text-gray-600"
          />
        ))}
      </div>
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

            {/* Rating Display */}
            <div className="flex items-center gap-3">
              {renderStars(averageRating, 20)}
              <span
                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                ({totalRatings} {totalRatings === 1 ? "review" : "reviews"})
              </span>
              {isLoggedIn && !isAdmin && (
                <button
                  onClick={() => setShowRatingModal(true)}
                  className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
                >
                  {userRating ? "Update Rating" : "Rate this item"}
                </button>
              )}
            </div>

            {/* Like/Dislike Buttons */}
            {isLoggedIn && !isAdmin && (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  disabled={isTogglingLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                    isLiked
                      ? "bg-red-500 text-white"
                      : darkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <ThumbsUp size={16} />
                  <span>{likeCount}</span>
                </button>
                <button
                  onClick={handleDislike}
                  disabled={isTogglingLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                    isDisliked
                      ? "bg-gray-500 text-white"
                      : darkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <ThumbsDown size={16} />
                  <span>{dislikeCount}</span>
                </button>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-amber-600 dark:text-amber-500">
                {item.price} ETB
              </span>
              {item.originalPrice && item.originalPrice > item.price && (
                <span className="text-lg text-gray-400 line-through">
                  {item.originalPrice} ETB
                </span>
              )}
            </div>

            {/* Sold Count */}
            {item.soldCount > 0 && (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <ShoppingCart size={16} />
                <span>{item.soldCount} items sold</span>
              </div>
            )}

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

            {/* Quantity Selector and Add to Cart */}
            {canAddToCart && !isOutOfStock && (
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

            {/* Add to Cart Button */}
            {canAddToCart && (
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

            {/* Login Prompt */}
            {!isLoggedIn && (
              <div
                className={`rounded-xl p-6 text-center transition-colors duration-300 ${
                  darkMode ? "bg-gray-800" : "bg-amber-50"
                }`}
              >
                <div className="text-4xl mb-3">🔒</div>
                <h3
                  className={`font-bold mb-2 transition-colors duration-300 ${
                    darkMode ? "text-white" : "text-amber-800"
                  }`}
                >
                  Login to Order
                </h3>
                <p
                  className={`text-sm mb-4 transition-colors duration-300 ${
                    darkMode ? "text-gray-400" : "text-amber-700"
                  }`}
                >
                  Please login to add items to your cart and place orders.
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition"
                >
                  Login Now
                </button>
              </div>
            )}

            {/* Admin Restriction */}
            {isLoggedIn && isAdmin && (
              <div
                className={`rounded-xl p-6 text-center border transition-colors duration-300 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-amber-50 border-amber-200"
                }`}
              >
                <div className="text-4xl mb-3">🔒</div>
                <h3
                  className={`font-bold mb-2 transition-colors duration-300 ${
                    darkMode ? "text-white" : "text-amber-800"
                  }`}
                >
                  Admin Restriction
                </h3>
                <p
                  className={`text-sm transition-colors duration-300 ${
                    darkMode ? "text-gray-400" : "text-amber-700"
                  }`}
                >
                  Admin accounts cannot add items to cart or place orders.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {!loadingRelated && relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2
                className={`text-2xl font-bold transition-colors duration-300 ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                You May Also Like
              </h2>
              <Link
                to="/menu"
                className={`text-sm transition-colors duration-300 ${
                  darkMode
                    ? "text-amber-400 hover:text-amber-300"
                    : "text-amber-600 hover:text-amber-700"
                }`}
              >
                View All Menu →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <FoodCard
                  key={product._id}
                  food={product}
                  onLikeUpdate={(productId, data) => {
                    // Update related product like count in state
                    setRelatedProducts((prev) =>
                      prev.map((p) =>
                        p._id === productId
                          ? {
                              ...p,
                              likeCount: data.likeCount,
                              userLiked: data.action === "liked",
                            }
                          : p,
                      ),
                    );
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-2xl max-w-md w-full p-6 transition-colors duration-300 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3
                className={`text-xl font-bold transition-colors duration-300 ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Rate {item.name}
              </h3>
              <button
                onClick={() => setShowRatingModal(false)}
                className={`p-1 rounded-full transition ${
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Star Rating */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Your Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        size={32}
                        className={`transition-colors ${
                          star <= (hoverRating || userRating || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Your Review (Optional)
                </label>
                <textarea
                  value={ratingReview}
                  onChange={(e) => setRatingReview(e.target.value)}
                  rows={3}
                  placeholder="Tell us what you think about this item..."
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSubmitRating}
                  disabled={isSubmittingRating}
                  className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition disabled:opacity-50"
                >
                  {isSubmittingRating ? "Submitting..." : "Submit Rating"}
                </button>
                <button
                  onClick={() => setShowRatingModal(false)}
                  className={`flex-1 border py-2 rounded-lg transition ${
                    darkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItemDetail;
