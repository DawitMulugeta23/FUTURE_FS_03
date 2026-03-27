import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/common/ScrollToTop";
import MainLayout from "./components/layout/MainLayout";
import AboutPage from "./pages/About/AboutPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CheckoutPage from "./pages/Checkout/CheckoutPage";
import ContactPage from "./pages/Contact/ContactPage";
import Home from "./pages/Home/Home";
import LoginPage from "./pages/Login/LoginPage";
import MenuPage from "./pages/Menu/MenuPage";
import OrdersPage from "./pages/Orders/OrdersPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import RegisterPage from "./pages/Register/RegisterPage";
import ReservationsPage from "./pages/Reservations/ReservationsPage";
import { getCurrentUser } from "./store/slices/authSlice";
import { fetchMenuItems, fetchSpecials } from "./store/slices/menuSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
    dispatch(fetchMenuItems());
    dispatch(fetchSpecials());
  }, [dispatch]);

  return (
    <ScrollToTop>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="reservations" element={<ReservationsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="checkout" element={<CheckoutPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </ScrollToTop>
  );
}

export default App;