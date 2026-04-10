// frontend/src/pages/AdminRegister.jsx
import axios from "axios";
import {
  BadgeCheck,
  Building,
  Lock,
  Mail,
  Phone,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    adminCode: "",
    department: "management",
    employeeId: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // Create submit data without confirmPassword
      const submitData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        adminCode: formData.adminCode,
        department: formData.department,
        employeeId: formData.employeeId,
      };

      await axios.post(
        "https://future-fs-03-db4a.onrender.com/api/auth/register/admin",
        submitData,
      );
      toast.success("Admin registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4 py-8">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg"
      >
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-amber-100 rounded-full mb-3">
            <Shield size={32} className="text-amber-700" />
          </div>
          <h2 className="text-3xl font-bold text-amber-900">
            Admin Registration
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Register as a cafe administrator
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <User
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-amber-500"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-amber-500"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="relative">
            <Phone
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-amber-500"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div className="relative">
            <Building
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <select
              className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-amber-500"
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
            >
              <option value="management">Management</option>
              <option value="kitchen">Kitchen</option>
              <option value="service">Service</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>

          <div className="relative">
            <BadgeCheck
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Employee ID (Optional)"
              className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-amber-500"
              value={formData.employeeId}
              onChange={(e) =>
                setFormData({ ...formData, employeeId: e.target.value })
              }
            />
          </div>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="password"
              placeholder="Admin Registration Code"
              className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-amber-500"
              value={formData.adminCode}
              onChange={(e) =>
                setFormData({ ...formData, adminCode: e.target.value })
              }
              required
            />
          </div>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-amber-500"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-amber-500"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-700 text-white py-3 rounded-xl font-bold hover:bg-amber-800 transition disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register as Admin"}
          </button>
        </div>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-amber-700 font-bold">
            Login
          </Link>
        </p>

        <p className="mt-2 text-center text-xs text-gray-400">
          <Link to="/register" className="hover:underline">
            Register as Customer
          </Link>
          {" | "}
          <Link to="/register/staff" className="hover:underline">
            Register as Staff
          </Link>
        </p>
      </form>
    </div>
  );
};

export default AdminRegister;
