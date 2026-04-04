// frontend/src/components/Admin/EditMenuItem.jsx
import axios from "axios";
import { AlertCircle, Save, Trash2, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../context/useTheme";

const EditMenuItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "Coffee",
    isAvailable: true,
  });
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/food/${id}`,
        );
        const item = response.data.data;
        setFormData({
          name: item.name,
          description: item.description,
          price: item.price,
          quantity: item.quantity,
          category: item.category,
          isAvailable: item.isAvailable,
        });
        setCurrentImage(item.image);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching item:", error);
        toast.error("Failed to load menu item");
        navigate("/admin/menu");
      }
    };

    fetchMenuItem();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("description", formData.description);
    submitData.append("price", formData.price);
    submitData.append("quantity", formData.quantity);
    submitData.append("category", formData.category);
    submitData.append("isAvailable", formData.isAvailable);

    if (image) {
      submitData.append("imagePath", image);
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/food/${id}`, submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Menu item updated successfully!");
      navigate("/admin/menu");
    } catch (error) {
      console.error("Error updating item:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to update menu item";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this menu item? This action cannot be undone.",
    );

    if (confirmDelete) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/food/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Menu item deleted successfully!");
        navigate("/admin/menu");
      } catch (error) {
        console.error("Error deleting item:", error);
        toast.error("Failed to delete menu item");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 dark:border-amber-500"></div>
      </div>
    );
  }

  // Define styles based on dark mode
  const containerBg = darkMode ? "bg-gray-800" : "bg-white";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-200";
  const textColor = darkMode ? "text-white" : "text-gray-800";
  const textSecondary = darkMode ? "text-gray-400" : "text-gray-500";
  const labelColor = darkMode ? "text-gray-300" : "text-gray-700";
  const inputBg = darkMode
    ? "bg-gray-700 border-gray-600 text-white"
    : "bg-white border-gray-300 text-gray-900";
  const selectBg = darkMode
    ? "bg-gray-700 border-gray-600 text-white"
    : "bg-white border-gray-300 text-gray-900";
  const buttonHover = darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100";
  const deleteButton = darkMode
    ? "border-red-700 text-red-400 hover:bg-red-900/30"
    : "border-red-300 text-red-600 hover:bg-red-50";

  return (
    <div className="max-w-4xl mx-auto">
      <div className={`rounded-2xl shadow p-6 ${containerBg}`}>
        {/* Header */}
        <div
          className={`flex justify-between items-center mb-6 pb-4 border-b ${borderColor}`}
        >
          <div>
            <h2 className={`text-2xl font-bold ${textColor}`}>
              Edit Menu Item
            </h2>
            <p className={`text-sm mt-1 ${textSecondary}`}>
              Update product information
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/menu")}
            className={`p-2 rounded-lg transition ${buttonHover} ${textSecondary}`}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Section */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
              Product Image
            </label>
            <div className="flex gap-4 items-start flex-wrap">
              <div className="relative">
                <img
                  src={imagePreview || currentImage}
                  alt={formData.name}
                  className={`w-32 h-32 object-cover rounded-lg border ${borderColor}`}
                />
                {image && (
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImagePreview("");
                    }}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <div className="flex-1">
                <label
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition w-fit ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                >
                  <Upload size={18} />
                  <span className="text-sm">Change Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className={`text-xs mt-2 ${textSecondary}`}>
                  Recommended: 800x600px, max 2MB
                </p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${labelColor}`}>
                Item Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none ${inputBg}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${labelColor}`}>
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none ${selectBg}`}
              >
                <option value="Coffee">Coffee</option>
                <option value="Pastry">Pastry</option>
                <option value="Meal">Meal</option>
                <option value="Drink">Drink</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${labelColor}`}>
                Price (ETB) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none ${inputBg}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${labelColor}`}>
                Quantity in Stock *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="0"
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none ${inputBg}`}
              />
            </div>

            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-1 ${labelColor}`}>
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none ${inputBg}`}
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 dark:bg-gray-700"
                />
                <span className={`text-sm ${labelColor}`}>
                  Item is available for sale
                </span>
              </label>
            </div>
          </div>

          {/* Warning for low stock */}
          {formData.quantity > 0 && formData.quantity <= 5 && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <AlertCircle
                size={18}
                className="text-yellow-600 dark:text-yellow-500"
              />
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                Low stock alert! Only {formData.quantity} items remaining.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className={`flex gap-3 pt-4 border-t ${borderColor}`}>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <Save size={18} />
              )}
              {submitting ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className={`px-6 py-2 border rounded-lg transition flex items-center gap-2 ${deleteButton}`}
            >
              <Trash2 size={18} />
              Delete Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMenuItem;
