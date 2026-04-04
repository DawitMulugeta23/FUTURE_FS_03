// frontend/src/components/Admin/MenuManager.jsx
import axios from "axios";
import { Edit, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/useTheme";

const MenuManager = () => {
  const { darkMode } = useTheme();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [currentItem, setCurrentItem] = useState({
    name: "",
    price: "",
    quantity: "1",
    description: "",
    category: "Coffee",
    image: null,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/food");
      setMenuItems(data.data);
    } catch (err) {
      console.error("Error fetching menu items", err);
      toast.error("Failed to fetch menu items");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem({ ...currentItem, [name]: value });
  };

  const handleImageChange = (e) => {
    setCurrentItem({ ...currentItem, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", currentItem.name);
    formData.append("price", currentItem.price);
    formData.append("quantity", currentItem.quantity);
    formData.append("description", currentItem.description);
    formData.append("category", currentItem.category);
    if (currentItem.image) {
      formData.append("imagePath", currentItem.image);
    }

    try {
      const token = localStorage.getItem("token");

      if (isEditing && editingId) {
        await axios.put(
          `http://localhost:5000/api/food/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        toast.success("Menu item updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/food", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Menu item added successfully!");
      }

      resetForm();
      fetchMenuItems();
    } catch (err) {
      console.error("Error saving menu item", err);
      toast.error(err.response?.data?.error || "Failed to save menu item");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/food/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Menu item deleted successfully!");
        fetchMenuItems();
      } catch (err) {
        console.error("Error deleting menu item", err);
        toast.error("Failed to delete menu item");
      }
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setCurrentItem({
      name: "",
      price: "",
      quantity: "1",
      description: "",
      category: "Coffee",
      image: null,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 dark:border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      <div
        className={`rounded-2xl shadow p-6 transition-colors duration-300 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h3
          className={`text-2xl font-bold mb-6 transition-colors duration-300 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          {isEditing ? "Edit Menu Item" : "Add New Menu Item"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Item Name
              </label>
              <input
                type="text"
                name="name"
                value={currentItem.name}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-colors duration-300 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:border-amber-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-amber-500"
                }`}
                required
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Price (ETB)
              </label>
              <input
                type="number"
                name="price"
                value={currentItem.price}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-colors duration-300 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:border-amber-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-amber-500"
                }`}
                required
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                min="0"
                value={currentItem.quantity}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-colors duration-300 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:border-amber-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-amber-500"
                }`}
                required
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Category
              </label>
              <select
                name="category"
                value={currentItem.category}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-colors duration-300 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="Coffee">Coffee</option>
                <option value="Pastry">Pastry</option>
                <option value="Meal">Meal</option>
                <option value="Drink">Drink</option>
              </select>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Image
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-colors duration-300 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white file:bg-gray-600 file:text-white file:border-0 file:rounded-lg file:px-3 file:py-1"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
              {currentItem.image && typeof currentItem.image === "object" && (
                <p
                  className={`text-xs mt-1 transition-colors duration-300 ${
                    darkMode ? "text-green-400" : "text-green-600"
                  }`}
                >
                  New image selected: {currentItem.image.name}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Description
            </label>
            <textarea
              name="description"
              value={currentItem.description}
              onChange={handleInputChange}
              rows={3}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-colors duration-300 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:border-amber-500"
                  : "bg-white border-gray-300 text-gray-900 focus:border-amber-500"
              }`}
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition flex items-center gap-2"
            >
              <Save size={18} />
              {isEditing ? "Update Item" : "Add Item"}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className={`border px-6 py-2 rounded-lg transition flex items-center gap-2 ${
                  darkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <X size={18} />
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Menu Items List */}
      <div
        className={`rounded-2xl shadow p-6 transition-colors duration-300 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h3
          className={`text-2xl font-bold mb-6 transition-colors duration-300 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Menu Items
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead
              className={`transition-colors duration-300 ${
                darkMode ? "bg-gray-700" : "bg-gray-50"
              }`}
            >
              <tr>
                <th
                  className={`px-4 py-3 text-left text-sm font-semibold transition-colors duration-300 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Image
                </th>
                <th
                  className={`px-4 py-3 text-left text-sm font-semibold transition-colors duration-300 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Name
                </th>
                <th
                  className={`px-4 py-3 text-left text-sm font-semibold transition-colors duration-300 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Category
                </th>
                <th
                  className={`px-4 py-3 text-left text-sm font-semibold transition-colors duration-300 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Price
                </th>
                <th
                  className={`px-4 py-3 text-left text-sm font-semibold transition-colors duration-300 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Quantity
                </th>
                <th
                  className={`px-4 py-3 text-left text-sm font-semibold transition-colors duration-300 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y transition-colors duration-300 ${
                darkMode ? "divide-gray-700" : "divide-gray-200"
              }`}
            >
              {menuItems.map((item) => (
                <tr
                  key={item._id}
                  className={`transition-colors duration-300 ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </td>
                  <td
                    className={`px-4 py-3 font-medium transition-colors duration-300 ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {item.name}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold transition-colors duration-300 ${
                        darkMode
                          ? "bg-amber-900/50 text-amber-300"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3 font-bold transition-colors duration-300 ${
                      darkMode ? "text-amber-400" : "text-amber-900"
                    }`}
                  >
                    {item.price} ETB
                  </td>
                  <td
                    className={`px-4 py-3 font-semibold transition-colors duration-300 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {item.quantity ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/menu/edit/${item._id}`)}
                        className="p-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded transition"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {menuItems.length === 0 && (
          <div
            className={`text-center py-8 transition-colors duration-300 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No menu items found. Click "Add New Menu Item" to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuManager;
