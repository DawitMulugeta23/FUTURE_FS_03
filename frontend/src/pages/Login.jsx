import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
      );
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      toast.success("Welcome back to Yesekela Café!");
      navigate("/menu");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-amber-900 mb-6 text-center">
          Login
        </h2>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full bg-amber-900 text-white py-3 rounded-xl font-bold hover:bg-amber-800 transition">
            Sign In
          </button>
        </div>
        <p className="mt-4 text-center text-gray-600">
          New customer?{" "}
          <Link to="/register" className="text-amber-700 font-bold">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
