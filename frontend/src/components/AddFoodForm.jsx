import axios from "axios";
import { useState } from "react";
const AddFoodForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Coffee",
    description: "",
  });
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Use FormData for file uploads
    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("imagePath", image); // This goes to Cloudinary via backend

    const token = localStorage.getItem("token");
    await axios.post("http://localhost:5000/api/food", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    alert("Item added to Menu!");
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow max-w-lg">
      <h3 className="text-2xl font-bold mb-6">Add New Dish</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Food Name"
          className="w-full p-3 border rounded-xl"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price (ETB)"
          className="w-full p-3 border rounded-xl"
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />
        <textarea
          placeholder="Description"
          className="w-full p-3 border rounded-xl"
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <input
          type="file"
          className="w-full"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button className="w-full bg-amber-600 text-white py-3 rounded-xl font-bold hover:bg-amber-700">
          Upload to Menu
        </button>
      </form>
    </div>
  );
};
export default AddFoodForm;
