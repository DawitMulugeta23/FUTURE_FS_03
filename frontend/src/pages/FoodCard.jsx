// frontend/src/components/FoodCard.jsx
import {
  Minus,
  Plus,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";
import { useTheme } from "../context/useTheme";

const FoodCard = ({ food }) => {
  const { addToCart, buyNow } = useCart();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [quantity, setQuantity] = useState(1);
  const [buyingNow, setBuyingNow] = useState(false);
  const maxQuantity =
    typeof food.quantity === "number" && food.quantity >= 0
      ? food.quantity
      : null;
  const isOutOfStock = maxQuantity === 0;

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const isLoggedIn = !!userInfo;
  const isAdmin = userInfo?.role === "admin";

  const canAddToCart = isLoggedIn && !isAdmin;

  // Price calculation with discount
  const currentPrice = food.price;
  const originalPrice = food.originalPrice || food.price;
  const hasDiscount = originalPrice > currentPrice;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;
  const isPriceIncreased = originalPrice < currentPrice;

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    if (isAdmin) {
      toast.error("Admins cannot place orders. Please use a customer account.");
      return;
    }

    if (isOutOfStock) {
      toast.error(`${food.name} is currently out of stock.`);
      return;
    }

    try {
      await addToCart(food, quantity);
      toast.success(
        `${quantity} ${food.name}${quantity > 1 ? "s" : ""} added to cart!`,
        {
          icon: "☕",
          duration: 2000,
        },
      );
    } catch (error) {
      toast.error("Failed to add to cart");
      console.error("Add to cart error:", error);
    }
  };

  const handleBuyNow = async (e) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    if (isAdmin) {
      toast.error("Admins cannot place orders.");
      return;
    }

    if (isOutOfStock) {
      toast.error(`${food.name} is currently out of stock.`);
      return;
    }

    setBuyingNow(true);
    const loadingToast = toast.loading("Preparing checkout...");

    try {
      const result = await buyNow(food._id, quantity);

      toast.dismiss(loadingToast);

      sessionStorage.setItem(
        "buyNowItem",
        JSON.stringify({
          item: result.orderItem,
          totalPrice: result.totalPrice,
        }),
      );

      navigate("/checkout");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.error || "Failed to process");
      setBuyingNow(false);
    }
  };

  const increaseQuantity = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    if (maxQuantity !== null && quantity >= maxQuantity) {
      toast.error(`Only ${maxQuantity} items available`);
      return;
    }
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleCardClick = () => {
    navigate(`/menu/${food._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`cursor-pointer group overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col h-full ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      {/* Image Container */}
      <div
        className={`relative h-48 overflow-hidden ${
          darkMode ? "bg-gray-700" : "bg-amber-50"
        }`}
      >
        <img
          src={food.image}
          alt={food.name}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />

        {/* Discount Badge */}
        {hasDiscount && !isOutOfStock && (
          <div className="absolute left-3 top-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold z-10 flex items-center gap-1">
            <TrendingDown size={12} />-{discountPercent}%
          </div>
        )}

        {/* Price Increase Badge */}
        {isPriceIncreased && !hasDiscount && !isOutOfStock && (
          <div className="absolute left-3 top-3 bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold z-10 flex items-center gap-1">
            <TrendingUp size={12} />
            Price Updated
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        {/* Title and Category */}
        <div className="mb-2">
          <h3
            className={`text-lg font-bold transition-colors duration-300 line-clamp-1 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {food.name}
          </h3>
          <p
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold transition-colors duration-300 ${
              darkMode
                ? "bg-amber-900/50 text-amber-300"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {food.category || "Menu Item"}
          </p>
        </div>

        {/* Description */}
        <p
          className={`mb-3 text-sm line-clamp-2 flex-1 transition-colors duration-300 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {food.description}
        </p>

        {/* Price Section - At the bottom */}
        <div className="mt-auto">
          {/* Price Display */}
          <div className="mb-3">
            {hasDiscount ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {currentPrice} ETB
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {originalPrice} ETB
                </span>
                <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                  Save {originalPrice - currentPrice} ETB
                </span>
              </div>
            ) : isPriceIncreased ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {currentPrice} ETB
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {originalPrice} ETB
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {currentPrice} ETB
              </span>
            )}
          </div>

          {/* Quantity and Buttons - Only for logged-in non-admin users */}
          {canAddToCart && !isOutOfStock && (
            <>
              <div
                className={`mb-3 flex items-center justify-between rounded-xl px-3 py-2 transition-colors duration-300 ${
                  darkMode ? "bg-gray-700" : "bg-amber-50"
                }`}
              >
                <span
                  className={`text-sm font-semibold transition-colors duration-300 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Quantity
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={isOutOfStock}
                    className={`rounded-lg p-1 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      darkMode
                        ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                        : "bg-white text-amber-900 hover:bg-amber-100"
                    }`}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-semibold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={isOutOfStock}
                    className={`rounded-lg p-1 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      darkMode
                        ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                        : "bg-white text-amber-900 hover:bg-amber-100"
                    }`}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2 font-semibold text-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 ${
                    isOutOfStock
                      ? "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                      : darkMode
                        ? "bg-amber-600 text-white hover:bg-amber-700"
                        : "bg-amber-100 text-amber-900 hover:bg-amber-900 hover:text-white"
                  }`}
                >
                  Add to Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock || buyingNow}
                  className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 font-semibold text-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 ${
                    isOutOfStock
                      ? "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  {buyingNow ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <ShoppingBag size={16} />
                  )}
                  Buy Now
                </button>
              </div>
            </>
          )}

          {/* Out of Stock Message */}
          {canAddToCart && isOutOfStock && (
            <button
              disabled
              className="w-full bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 rounded-xl py-2 font-semibold text-sm cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}

          {/* Login to Order Button */}
          {!isLoggedIn && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/login");
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-2 font-semibold text-sm transition bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Login to Order
            </button>
          )}

          {/* Admin Restriction Message */}
          {isLoggedIn && isAdmin && (
            <div className="mt-2 p-2 rounded-lg text-center text-xs bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
              🔒 Admin accounts cannot place orders
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
