import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheckCircle, FaRegStar, FaStar, FaTrash } from "react-icons/fa";
import apiClient from "../../services/api/apiClient";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await apiClient.get("/reviews");
      setReviews(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch reviews");
      console.error("Fetch reviews error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const approveReview = async (id) => {
    try {
      await apiClient.patch(`/reviews/${id}/approve`);
      toast.success("Review approved");
      fetchReviews();
    } catch (error) {
      toast.error("Failed to approve review");
      console.error("Approve review error:", error);
    }
  };

  const deleteReview = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await apiClient.delete(`/reviews/${id}`);
        toast.success("Review deleted");
        fetchReviews();
      } catch (error) {
        toast.error("Failed to delete review");
        console.error("Delete review error:", error);
      }
    }
  };

  const filteredReviews =
    filter === "all"
      ? reviews
      : filter === "approved"
        ? reviews.filter((r) => r.isApproved)
        : reviews.filter((r) => !r.isApproved);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-playfair font-bold text-coffee-800">
          Review Management
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === "all"
                ? "bg-coffee-500 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            All ({reviews.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === "pending"
                ? "bg-coffee-500 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Pending ({reviews.filter((r) => !r.isApproved).length})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === "approved"
                ? "bg-coffee-500 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Approved ({reviews.filter((r) => r.isApproved).length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredReviews.map((review, index) => (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{review.userName}</h3>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) =>
                    i < review.rating ? (
                      <FaStar key={i} className="text-yellow-400" size={16} />
                    ) : (
                      <FaRegStar key={i} className="text-gray-300" size={16} />
                    ),
                  )}
                  <span className="text-sm text-gray-500 ml-2">
                    {review.rating}/5
                  </span>
                </div>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  review.isApproved
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {review.isApproved ? "Approved" : "Pending Approval"}
              </div>
            </div>

            {review.title && (
              <h4 className="font-medium text-gray-800 mb-2">{review.title}</h4>
            )}
            <p className="text-gray-600 mb-3">{review.comment}</p>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{new Date(review.createdAt).toLocaleDateString()}</span>
              {review.menuItem && (
                <span>• {review.menuItem?.name || "Menu Item"}</span>
              )}
            </div>

            <div className="flex gap-3 mt-4 pt-3 border-t">
              {!review.isApproved && (
                <button
                  onClick={() => approveReview(review._id)}
                  className="flex items-center gap-2 text-green-600 hover:text-green-700 text-sm"
                >
                  <FaCheckCircle size={16} />
                  Approve
                </button>
              )}
              <button
                onClick={() => deleteReview(review._id)}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm"
              >
                <FaTrash size={14} />
                Delete
              </button>
            </div>
          </motion.div>
        ))}

        {filteredReviews.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <p className="text-gray-500">No reviews found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
