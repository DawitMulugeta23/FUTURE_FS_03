import axios from "axios";
import { Send, Star, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const FeedbackModal = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!message.trim()) {
      toast.error("Please enter your feedback message");
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://future-fs-03-db4a.onrender.com/api/feedback",
        { rating, title, message },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Thank you for your feedback!");
      setRating(0);
      setTitle("");
      setMessage("");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-gray-800">
              Share Your Feedback
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating Stars */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      size={32}
                      className={`transition-colors ${
                        star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief summary of your feedback"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                maxLength={100}
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Feedback
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Tell us about your experience..."
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">
                {message.length}/1000 characters
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <Send size={18} />
              )}
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>

          <div className="mt-4 p-3 bg-amber-50 rounded-lg">
            <p className="text-sm text-amber-800">
              💡 Your feedback helps us improve! We read every submission
              carefully.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
