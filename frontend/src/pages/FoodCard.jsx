// frontend/src/components/FoodCard.jsx
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";
import { useTheme } from "../context/useTheme";

const FoodCard = ({ food }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [quantity, setQuantity] = useState(1);
  const maxQuantity =
    typeof food.quantity === "number" && food.quantity >= 0
      ? food.quantity
      : null;
  const isOutOfStock = maxQuantity === 0;

  // Check if user is admin
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const isAdmin = userInfo?.role === "admin";

  const handleAddToCart = (e) => {
    e.stopPropagation();

    if (isAdmin) {
      toast.error("Admins cannot place orders. Please use a customer account.");
      return;
    }

    if (isOutOfStock) {
      toast.error(`${food.name} is currently out of stock.`);
      return;
    }

    addToCart(food, quantity);
    toast.success(
      `${quantity} ${food.name}${quantity > 1 ? "s" : ""} added to cart!`,
      {
        icon: "☕",
        duration: 2000,
      },
    );
  };

  const increaseQuantity = (e) => {
    e.stopPropagation();
    if (isAdmin) {
      toast.error("Admins cannot place orders.");
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
    if (isAdmin) {
      toast.error("Admins cannot place orders.");
      return;
    }
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleQuantityChange = (e) => {
    e.stopPropagation();
    if (isAdmin) {
      toast.error("Admins cannot place orders.");
      return;
    }
    const value = Number(e.target.value);
    if (Number.isNaN(value)) {
      setQuantity(1);
      return;
    }
    const nextValue = Math.max(1, value);
    if (maxQuantity !== null) {
      setQuantity(Math.min(maxQuantity, nextValue));
    } else {
      setQuantity(nextValue);
    }
  };

  const handleCardClick = () => {
    navigate(`/menu/${food._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`cursor-pointer group overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div
        className={`relative h-48 overflow-hidden ${
          darkMode ? "bg-gray-700" : "bg-amber-50"
        }`}
      >
        <img
          src={food.image}
          alt={food.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-sm font-bold shadow-lg ${
            darkMode ? "bg-gray-900 text-amber-400" : "bg-white text-amber-900"
          }`}
        >
          {food.price} ETB
        </span>
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3
              className={`text-xl font-bold transition-colors duration-300 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {food.name}
            </h3>
            <p
              className={`mt-1 inline-block rounded-full px-2 py-1 text-xs font-semibold transition-colors duration-300 ${
                darkMode
                  ? "bg-amber-900/50 text-amber-300"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {food.category || "Menu Item"}
            </p>
            {typeof food.quantity === "number" && !isAdmin && (
              <p
                className={`mt-2 text-xs font-medium transition-colors duration-300 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {food.quantity > 0
                  ? `🍽️ Available: ${food.quantity}`
                  : "❌ Out of stock"}
              </p>
            )}
          </div>
        </div>

        <p
          className={`mb-4 min-h-[40px] text-sm line-clamp-2 transition-colors duration-300 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {food.description}
        </p>

        {/* Only show ordering options for non-admin users */}
        {!isAdmin && (
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
                📦 Quantity
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
                <input
                  type="number"
                  min="1"
                  max={maxQuantity ?? undefined}
                  value={quantity}
                  onChange={handleQuantityChange}
                  onClick={(e) => e.stopPropagation()}
                  disabled={isOutOfStock}
                  className={`w-14 rounded-lg border px-2 py-1 text-center text-sm font-semibold outline-none focus:ring-2 focus:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-300 ${
                    darkMode
                      ? "bg-gray-600 border-gray-500 text-white focus:border-amber-500"
                      : "bg-white border-amber-200 text-gray-900 focus:border-amber-500"
                  }`}
                />
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

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 ${
                isOutOfStock
                  ? "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                  : darkMode
                    ? "bg-amber-600 text-white hover:bg-amber-700"
                    : "bg-amber-100 text-amber-900 hover:bg-amber-900 hover:text-white"
              }`}
            >
              <Plus size={18} />
              {isOutOfStock
                ? "Out of Stock"
                : `Add to Cart • ${(food.price * quantity).toFixed(0)} ETB`}
            </button>
          </>
        )}

        {/* Admin message when logged in as admin */}
        {isAdmin && (
          <div
            className={`mt-3 p-2 rounded-lg text-center text-xs transition-colors duration-300 ${
              darkMode
                ? "bg-gray-700 text-gray-400"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            🔒 Admin accounts cannot place orders
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodCard;
