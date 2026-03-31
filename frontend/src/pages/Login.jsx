import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/useTheme";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
      );
      localStorage.setItem("token", data.token); // Store token for orders
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      toast.success("Welcome back to Yesekela Café!");
      navigate("/menu");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login Failed");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${darkMode ? "bg-gray-900" : "bg-amber-50"}`}
    >
      <form
        onSubmit={handleLogin}
        className={`w-full max-w-md rounded-2xl p-8 shadow-xl ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}
      >
        <h2
          className={`mb-6 text-center text-3xl font-bold ${darkMode ? "text-amber-400" : "text-amber-900"}`}
        >
          Login
        </h2>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className={`w-full rounded-xl border p-3 ${darkMode ? "border-gray-600 bg-gray-700 text-white placeholder:text-gray-300" : "border-gray-300 bg-white text-gray-800"}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className={`w-full rounded-xl border p-3 ${darkMode ? "border-gray-600 bg-gray-700 text-white placeholder:text-gray-300" : "border-gray-300 bg-white text-gray-800"}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full rounded-xl bg-amber-900 py-3 font-bold text-white transition hover:bg-amber-800">
            Sign In
          </button>
        </div>
        <p className={`mt-4 text-center ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          New customer?{" "}
          <Link to="/register" className="font-bold text-amber-700">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
