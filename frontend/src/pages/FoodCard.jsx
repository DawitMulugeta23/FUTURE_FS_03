import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { useCart } from "../context/useCart";
const FoodCard = ({ food }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(food);
    toast.success(`${food.name} added to cart!`, {
      icon: "☕",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
      duration: 2000,
    });
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
          </div>
        </div>

        <p className="mb-4 min-h-[40px] text-sm text-gray-500 line-clamp-2">
          {food.description}
        </p>

        <button
          onClick={handleAddToCart}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-100 py-2 font-bold text-amber-900 transition hover:bg-amber-900 hover:text-white"
        >
          <Plus size={18} /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default FoodCard;
