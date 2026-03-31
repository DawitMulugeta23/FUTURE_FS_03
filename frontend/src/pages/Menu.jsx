import axios from "axios";
import { Coffee, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import FoodCard from "./FoodCard";

const categories = ["All", "Coffee", "Pastry", "Meal", "Drink"];

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/food");
        setFoods(data.data || []);
      } catch (error) {
        console.error("Failed to load menu", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchesCategory =
        selectedCategory === "All" || food.category === selectedCategory;
      const matchesSearch = [food.name, food.description, food.category]
        .filter(Boolean)
        .some((value) =>
          value.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      return matchesCategory && matchesSearch;
    });
  }, [foods, searchTerm, selectedCategory]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 overflow-hidden rounded-3xl bg-gradient-to-r from-amber-900 via-amber-800 to-orange-700 px-6 py-10 text-white shadow-xl md:px-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium">
                <Sparkles size={16} /> Freshly prepared every day
              </p>
              <h1 className="text-4xl font-bold md:text-5xl">
                Yesekela Café Menu
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-amber-100 md:text-base">
                Discover our coffee, pastries, meals, and refreshing drinks —
                made with care and ready to enjoy.
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3 text-amber-100">
                <Coffee size={24} />
                <div>
                  <p className="text-sm">Available items</p>
                  <p className="text-2xl font-bold text-white">
                    {foods.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 outline-none transition focus:border-amber-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedCategory === category
                    ? "bg-amber-700 text-white shadow"
                    : "bg-amber-100 text-amber-900 hover:bg-amber-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex h-56 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-200 border-t-amber-700" />
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-amber-900">
              No items found
            </h2>
            <p className="mt-2 text-gray-500">
              Try a different search or category.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredFoods.map((food) => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Menu;
