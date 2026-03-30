import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, isAdmin = false }) => {
  const token = localStorage.getItem("token");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (isAdmin && userInfo?.role !== "admin") {
    return <Navigate to="/" />; // Redirect non-admins to home
  }

  return children;
};

export default ProtectedRoute;
