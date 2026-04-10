import axios from "axios";
import { AlertCircle, Edit, Save, Trash2, X } from "lucide-react";
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
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://future-fs-03-db4a.onrender.com/api/food/admin/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setMenuItems(response.data.data.all);
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
          `https://future-fs-03-db4a.onrender.com/api/food/${editingId}`,
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
        await axios.post(
          "https://future-fs-03-db4a.onrender.com/api/food",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
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
        await axios.delete(
          `https://future-fs-03-db4a.onrender.com/api/food/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
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

  const outOfStockItems = menuItems.filter((item) => item.quantity === 0);
  const inStockItems = menuItems.filter((item) => item.quantity > 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 dark:border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        className={`rounded-2xl shadow p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <h3
          className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}
        >
          {isEditing ? "Edit Menu Item" : "Add New Menu Item"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Item Name
              </label>
              <input
                type="text"
                name="name"
                value={currentItem.name}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
                required
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Price (ETB)
              </label>
              <input
                type="number"
                name="price"
                value={currentItem.price}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
                required
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                min="0"
                value={currentItem.quantity}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
                required
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Category
              </label>
              <select
                name="category"
                value={currentItem.category}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
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
                className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Image
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              />
            </div>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Description
            </label>
            <textarea
              name="description"
              value={currentItem.description}
              onChange={handleInputChange}
              rows={3}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300"
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

      {/* In Stock Items */}
      <div
        className={`rounded-2xl shadow p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <h3
          className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}
        >
          In Stock Items ({inStockItems.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Image
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"}`}
            >
              {inStockItems.map((item) => (
                <tr
                  key={item._id}
                  className={
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  }
                >
                  <td className="px-4 py-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </td>
                  <td
                    className={`px-4 py-3 font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                  >
                    {item.name}
                    {item.quantity <= 5 && (
                      <span className="ml-2 text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full">
                        Low Stock
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        darkMode
                          ? "bg-amber-900/50 text-amber-300"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3 font-bold ${darkMode ? "text-amber-400" : "text-amber-900"}`}
                  >
                    {item.price} ETB
                  </td>
                  <td
                    className={`px-4 py-3 font-semibold ${item.quantity <= 5 ? "text-yellow-600 dark:text-yellow-400" : darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/menu/edit/${item._id}`)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition"
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
      </div>

      {/* Out of Stock Items Section */}
      {outOfStockItems.length > 0 && (
        <div
          className={`rounded-2xl shadow p-6 ${darkMode ? "bg-gray-800 border border-red-800/50" : "bg-white border border-red-200"}`}
        >
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle size={24} className="text-red-500" />
            <h3
              className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
            >
              Out of Stock Items ({outOfStockItems.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={darkMode ? "bg-red-900/30" : "bg-red-100"}>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Image
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${darkMode ? "divide-red-800/30" : "divide-red-200"}`}
              >
                {outOfStockItems.map((item) => (
                  <tr
                    key={item._id}
                    className={
                      darkMode ? "hover:bg-red-900/20" : "hover:bg-red-50/50"
                    }
                  >
                    <td className="px-4 py-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg opacity-50"
                      />
                    </td>
                    <td
                      className={`px-4 py-3 font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {item.name}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-400">
                      {item.price} ETB
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                        <AlertCircle size={12} />
                        Out of Stock
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => navigate(`/admin/menu/edit/${item._id}`)}
                        className="px-3 py-1 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700 transition"
                      >
                        Restock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManager;
