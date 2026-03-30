import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { useCart } from "../context/CartContext";

const FoodCard = ({ food }) => {
  const { addToCart } = useCart();

  // Logic for adding to cart + showing the toast
  const handleAddToCart = () => {
    addToCart(food);
    toast.success(`${food.name} added to cart!`, {
      icon: "☕",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
      duration: 2000, // Optional: how long it stays on screen
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-2 right-2 bg-white px-2 py-1 rounded-lg font-bold text-amber-900 shadow">
          {food.price} ETB
        </span>
      </div>

      {/* Details Section */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800">{food.name}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {food.description}
        </p>

        {/* Button - Now calling the correct handler */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-amber-100 text-amber-900 font-bold py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-amber-900 hover:text-white transition"
        >
          <Plus size={18} /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default FoodCard;
