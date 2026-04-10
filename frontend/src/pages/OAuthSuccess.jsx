// frontend/src/pages/OAuthSuccess.jsx
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      toast.error("Google authentication failed. Please try again.");
      navigate("/login");
      return;
    }

    if (token) {
      // Store token and get user info
      localStorage.setItem("token", token);

      // Fetch user profile
      axios
        .get("https://future-fs-03-db4a.onrender.com/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data.success) {
            localStorage.setItem(
              "userInfo",
              JSON.stringify(response.data.user),
            );
            toast.success(`Welcome ${response.data.user.name}!`);
            navigate("/menu");
          }
        })
        .catch((err) => {
          console.error("Failed to fetch user profile:", err);
          toast.error("Login successful but failed to load profile");
          navigate("/menu");
        });
    } else {
      toast.error("Invalid authentication response");
      navigate("/login");
    }
  }, [token, error, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing login...</p>
      </div>
    </div>
  );
};

export default OAuthSuccess;
