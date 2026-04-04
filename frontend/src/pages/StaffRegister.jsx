// frontend/src/pages/StaffRegister.jsx
import axios from "axios";
import { Building, Clock, Lock, Mail, Phone, User, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const StaffRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    managerCode: "",
    department: "service",
    shift: "morning",
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
      const submitData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        managerCode: formData.managerCode,
        department: formData.department,
        shift: formData.shift,
        employeeId: formData.employeeId,
      };

      await axios.post(
        "http://localhost:5000/api/auth/register/staff",
        submitData,
      );
      toast.success("Staff registration successful! Please login.");
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
            <Users size={32} className="text-amber-700" />
          </div>
          <h2 className="text-3xl font-bold text-amber-900">
            Staff Registration
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Register as a cafe staff member
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
              <option value="service">Service</option>
              <option value="kitchen">Kitchen</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>

          <div className="relative">
            <Clock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <select
              className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-amber-500"
              value={formData.shift}
              onChange={(e) =>
                setFormData({ ...formData, shift: e.target.value })
              }
            >
              <option value="morning">Morning Shift (7AM - 3PM)</option>
              <option value="evening">Evening Shift (3PM - 11PM)</option>
              <option value="night">Night Shift (11PM - 7AM)</option>
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
              placeholder="Manager Registration Code"
              className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-amber-500"
              value={formData.managerCode}
              onChange={(e) =>
                setFormData({ ...formData, managerCode: e.target.value })
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
            {loading ? "Registering..." : "Register as Staff"}
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
          <Link to="/register/admin" className="hover:underline">
            Register as Admin
          </Link>
        </p>
      </form>
    </div>
  );
};

export default StaffRegister;
