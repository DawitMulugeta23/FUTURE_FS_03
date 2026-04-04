// frontend/src/pages/Menu.jsx
import axios from "axios";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "../context/useTheme";
import FoodCard from "../pages/FoodCard";

const categories = ["All", "Coffee", "Pastry", "Meal", "Drink"];

const Menu = () => {
  const { darkMode } = useTheme();
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
    <section
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-amber-50 via-white to-orange-50"
      }`}
    >
      {/* Sticky Search and Filter Bar */}
      <div
        className={`sticky top-[73px] z-40 shadow-md border-b transition-colors duration-300 ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search
                size={18}
                className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                  darkMode ? "text-gray-400" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full rounded-xl border py-3 pl-10 pr-4 outline-none transition focus:ring-2 focus:ring-amber-500 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-amber-500"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-amber-500"
                }`}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    selectedCategory === category
                      ? darkMode
                        ? "bg-amber-600 text-white shadow"
                        : "bg-amber-700 text-white shadow"
                      : darkMode
                        ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        : "bg-amber-100 text-amber-900 hover:bg-amber-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Food Items Grid */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        {loading ? (
          <div className="flex h-56 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-200 border-t-amber-700 dark:border-gray-700 dark:border-t-amber-500" />
          </div>
        ) : filteredFoods.length === 0 ? (
          <div
            className={`rounded-2xl p-10 text-center shadow-sm transition-colors duration-300 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2
              className={`text-2xl font-bold transition-colors duration-300 ${
                darkMode ? "text-amber-400" : "text-amber-900"
              }`}
            >
              No items found
            </h2>
            <p
              className={`mt-2 transition-colors duration-300 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
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
