import axios from "axios";
import { Edit, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const MenuManager = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    name: "",
    price: "",
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

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditingId(item._id);
    setCurrentItem({
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.category,
      image: null,
    });
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
      description: "",
      category: "Coffee",
      image: null,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">
          {isEditing ? "Edit Menu Item" : "Add New Menu Item"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name
              </label>
              <input
                type="text"
                name="name"
                value={currentItem.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (ETB)
              </label>
              <input
                type="number"
                name="price"
                value={currentItem.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={currentItem.category}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="Coffee">Coffee</option>
                <option value="Pastry">Pastry</option>
                <option value="Meal">Meal</option>
                <option value="Drink">Drink</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={currentItem.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
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
                className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
              >
                <X size={18} />
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Menu Items List */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Menu Items</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Image
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {menuItems.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-amber-900">
                    {item.price} ETB
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
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
    </div>
  );
};

export default MenuManager;
