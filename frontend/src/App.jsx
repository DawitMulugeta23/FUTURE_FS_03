import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from './store/slices/authSlice';
import { fetchMenuItems, fetchSpecials } from './store/slices/menuSlice';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home/Home';
import MenuPage from './pages/Menu/MenuPage';
import AboutPage from './pages/About/AboutPage';
import ContactPage from './pages/Contact/ContactPage';
import ReservationsPage from './pages/Reservations/ReservationsPage';
import OrdersPage from './pages/Orders/OrdersPage';
import ProfilePage from './pages/Profile/ProfilePage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import CheckoutPage from './pages/Checkout/CheckoutPage';
import ScrollToTop from './components/common/ScrollToTop';

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
      </Routes>
    </ScrollToTop>
  );
}

export default App;