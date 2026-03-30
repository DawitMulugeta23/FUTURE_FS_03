import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiEdit2, FiPlus, FiSave, FiTrash2, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import apiClient from "../../services/api/apiClient";
import { fetchMenuItems } from "../../store/slices/menuSlice";

const MenuManager = () => {
  const { items, isLoading } = useSelector((state) => state.menu);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    ingredients: "",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
    isSpecial: false,
    preparationTime: 15,
  });

  const loadCategories = async () => {
    try {
      const response = await apiClient.get("/menu/categories");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
      toast.error("Failed to load categories");
    }
  };

  const handleOpenModal = async (item = null) => {
    if (categories.length === 0) {
      await loadCategories();
    }
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        category: item.category?._id || item.category,
        price: item.price,
        description: item.description || "",
        ingredients: item.ingredients?.join(", ") || "",
        isVegetarian: item.isVegetarian || false,
        isVegan: item.isVegan || false,
        isGlutenFree: item.isGlutenFree || false,
        isAvailable: item.isAvailable !== false,
        isSpecial: item.isSpecial || false,
        preparationTime: item.preparationTime || 15,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        category: "",
        price: "",
        description: "",
        ingredients: "",
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        isAvailable: true,
        isSpecial: false,
        preparationTime: 15,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        price: parseFloat(formData.price),
        ingredients: formData.ingredients
          .split(",")
          .map((i) => i.trim())
          .filter((i) => i),
        preparationTime: parseInt(formData.preparationTime),
      };

      if (editingItem) {
        await apiClient.put(`/admin/menu/${editingItem._id}`, dataToSend);
        toast.success("Menu item updated successfully");
      } else {
        await apiClient.post("/admin/menu", dataToSend);
        toast.success("Menu item created successfully");
      }

      dispatch(fetchMenuItems());
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await apiClient.delete(`/admin/menu/${id}`);
        toast.success("Menu item deleted");
        dispatch(fetchMenuItems());
      } catch (error) {
        toast.error("Failed to delete item");
        console.error("Delete error:", error);
      }
    }
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      await apiClient.patch(`/admin/menu/${id}/availability`);
      toast.success(`Item ${currentStatus ? "unavailable" : "available"}`);
      dispatch(fetchMenuItems());
    } catch (error) {
      toast.error("Failed to update status");
      console.error("Status toggle error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-playfair font-bold text-coffee-800">
          Menu Management
        </h2>
        <button
          onClick={() => handleOpenModal()}
          className="bg-coffee-500 hover:bg-coffee-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FiPlus size={20} />
          Add New Item
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-coffee-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Image
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Category
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Price
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <img
                    src={item.image || "https://via.placeholder.com/40"}
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4 font-medium">{item.name}</td>
                <td className="px-6 py-4">
                  {item.category?.name || "Uncategorized"}
                </td>
                <td className="px-6 py-4">${item.price}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() =>
                      handleToggleAvailability(item._id, item.isAvailable)
                    }
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.isAvailable
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-playfair font-bold">
                  {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-coffee-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-coffee-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (ETB)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-coffee-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preparation Time (mins)
                    </label>
                    <input
                      type="number"
                      name="preparationTime"
                      value={formData.preparationTime}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-coffee-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-coffee-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ingredients (comma separated)
                  </label>
                  <input
                    type="text"
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleChange}
                    placeholder="Coffee, Milk, Sugar"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-coffee-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isVegetarian"
                      checked={formData.isVegetarian}
                      onChange={handleChange}
                      className="w-4 h-4 text-coffee-500"
                    />
                    <label className="text-sm text-gray-700">Vegetarian</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isVegan"
                      checked={formData.isVegan}
                      onChange={handleChange}
                      className="w-4 h-4 text-coffee-500"
                    />
                    <label className="text-sm text-gray-700">Vegan</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isGlutenFree"
                      checked={formData.isGlutenFree}
                      onChange={handleChange}
                      className="w-4 h-4 text-coffee-500"
                    />
                    <label className="text-sm text-gray-700">Gluten Free</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isSpecial"
                      checked={formData.isSpecial}
                      onChange={handleChange}
                      className="w-4 h-4 text-coffee-500"
                    />
                    <label className="text-sm text-gray-700">
                      Daily Special
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-coffee-500 text-white rounded-lg hover:bg-coffee-600 transition-colors flex items-center gap-2"
                  >
                    <FiSave size={18} />
                    {editingItem ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuManager;
