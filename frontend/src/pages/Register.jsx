import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useTheme } from "../context/useTheme";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      toast.success('Registration successful! Check your email.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration Failed');
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${darkMode ? "bg-gray-900" : "bg-amber-50"}`}
    >
      <form
        onSubmit={handleRegister}
        className={`w-full max-w-md rounded-2xl p-8 shadow-xl ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}
      >
        <h2
          className={`mb-6 text-center text-3xl font-bold ${darkMode ? "text-amber-400" : "text-amber-900"}`}
        >
          Join Yesekela
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className={`w-full rounded-xl border p-3 ${darkMode ? "border-gray-600 bg-gray-700 text-white placeholder:text-gray-300" : "border-gray-300 bg-white text-gray-800"}`}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className={`w-full rounded-xl border p-3 ${darkMode ? "border-gray-600 bg-gray-700 text-white placeholder:text-gray-300" : "border-gray-300 bg-white text-gray-800"}`}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className={`w-full rounded-xl border p-3 ${darkMode ? "border-gray-600 bg-gray-700 text-white placeholder:text-gray-300" : "border-gray-300 bg-white text-gray-800"}`}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button className="w-full rounded-xl bg-amber-600 py-3 font-bold text-white transition hover:bg-amber-700">
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;