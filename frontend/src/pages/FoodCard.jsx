// frontend/src/components/FoodCard.jsx
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";

const FoodCard = ({ food }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
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
      className="cursor-pointer group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-48 overflow-hidden bg-amber-50">
        <img
          src={food.image}
          alt={food.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-sm font-bold text-amber-900 shadow">
          {food.price} ETB
        </span>
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              Out of Stock
            </span>
          </div>
        )}
        {isAdmin && (
          <div className="absolute inset-0 bg-amber-900/80 flex items-center justify-center">
            <span className="bg-amber-700 text-white px-3 py-1 rounded-full text-sm font-bold">
              Admin View Only
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{food.name}</h3>
            <p className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
              {food.category || "Menu Item"}
            </p>
            {typeof food.quantity === "number" && !isAdmin && (
              <p className="mt-2 text-xs font-medium text-gray-500">
                {food.quantity > 0
                  ? `Available: ${food.quantity}`
                  : "Out of stock"}
              </p>
            )}
          </div>
        </div>

        <p className="mb-4 min-h-[40px] text-sm text-gray-500 line-clamp-2">
          {food.description}
        </p>

        {/* Only show ordering options for non-admin users */}
        {!isAdmin && (
          <>
            <div className="mb-3 flex items-center justify-between rounded-xl bg-amber-50 px-3 py-2">
              <span className="text-sm font-semibold text-gray-700">
                Quantity
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={isOutOfStock}
                  className="rounded-lg bg-white p-1 text-amber-900 shadow-sm hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="w-14 rounded-lg border border-amber-200 bg-white px-2 py-1 text-center text-sm font-semibold outline-none focus:border-amber-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                />
                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={isOutOfStock}
                  className="rounded-lg bg-white p-1 text-amber-900 shadow-sm hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-100 py-2 font-bold text-amber-900 transition hover:bg-amber-900 hover:text-white disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
            >
              <Plus size={18} /> {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          </>
        )}

        {/* Show admin message instead of ordering options */}
        {isAdmin && (
          <div className="mt-3 p-3 bg-gray-100 rounded-xl text-center">
            <p className="text-sm text-gray-600">
              🔒 Admin accounts cannot place orders
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Switch to a customer account to order
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodCard;
