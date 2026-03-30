import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider } from "./context/CartContext";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import Orders from "./pages/Orders";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import {Toaster } from "react-hot-toast";
function App() {
  return (
    <CartProvider>
      <Toaster position="top-center" reverseOrder={false}/>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/myorders" element={<Orders />} />
        <Route
          path="/myorders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={<ProtectedRoute isAdmin={true}>
          <AdminDashboard/> </ProtectedRoute>} />
      </Routes>
    </CartProvider>
  );
}

export default App;
