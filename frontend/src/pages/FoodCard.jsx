import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useCart } from "../context/useCart";

const FoodCard = ({ food }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const maxQuantity =
    typeof food.quantity === "number" && food.quantity >= 0 ? food.quantity : null;
  const isOutOfStock = maxQuantity === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error(`${food.name} is currently out of stock.`);
      return;
    }

    addToCart(food, quantity);
    toast.success(`${quantity} ${food.name}${quantity > 1 ? "s" : ""} added to cart!`, {
      icon: "☕",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
      duration: 2000,
    });
  };

  const increaseQuantity = () =>
    setQuantity((prev) => {
      if (maxQuantity === null) return prev + 1;
      return Math.min(maxQuantity, prev + 1);
    });

  const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);

    if (Number.isNaN(value)) {
      setQuantity(1);
      return;
    }

    const nextValue = Math.max(1, value);
    setQuantity(maxQuantity === null ? nextValue : Math.min(maxQuantity, nextValue));
  };

  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-48 overflow-hidden bg-amber-50">
        <img
          src={food.image}
          alt={food.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-sm font-bold text-amber-900 shadow">
          {food.price} ETB
        </span>
      </div>

      <div className="p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{food.name}</h3>
            <p className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
              {food.category || "Menu Item"}
            </p>
            {typeof food.quantity === "number" && (
              <p className="mt-2 text-xs font-medium text-gray-500">
                {food.quantity > 0 ? `Available: ${food.quantity}` : "Out of stock"}
              </p>
            )}
          </div>
        </div>

        <p className="mb-4 min-h-[40px] text-sm text-gray-500 line-clamp-2">
          {food.description}
        </p>

        <div className="mb-3 flex items-center justify-between rounded-xl bg-amber-50 px-3 py-2">
          <span className="text-sm font-semibold text-gray-700">Quantity</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={decreaseQuantity}
              className="rounded-lg bg-white p-1 text-amber-900 shadow-sm hover:bg-amber-100"
            >
              <Minus size={16} />
            </button>
            <input
              type="number"
              min="1"
              max={maxQuantity ?? undefined}
              value={quantity}
              onChange={handleQuantityChange}
              disabled={isOutOfStock}
              className="w-14 rounded-lg border border-amber-200 bg-white px-2 py-1 text-center text-sm font-semibold outline-none focus:border-amber-500 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
            <button
              type="button"
              onClick={increaseQuantity}
              className="rounded-lg bg-white p-1 text-amber-900 shadow-sm hover:bg-amber-100"
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
      </div>
    </div>
  );
};

export default FoodCard;
