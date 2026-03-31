import axios from "axios";
import { CheckCircle, Mail, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const FeedbackManager = () => {
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalFeedback: 0,
    pendingCount: 0,
    repliedCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [showReplyModal, setShowReplyModal] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, [filter]);

  const fetchFeedback = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `http://localhost:5000/api/admin/feedback${filter !== "all" ? `?status=${filter}` : ""}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setFeedback(data.data);
      setStats(data.stats);
    } catch (err) {
      toast.error("Failed to fetch feedback");
      console.error("Fetch feedback error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) {
      toast.error("Please enter a reply message");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/admin/feedback/${selectedFeedback._id}/reply`,
        { message: replyMessage },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Reply sent successfully!");
      setShowReplyModal(false);
      setReplyMessage("");
      fetchFeedback();
    } catch (err) {
      toast.error("Failed to send reply");
      console.error("Reply to feedback error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/admin/feedback/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Feedback deleted successfully");
        fetchFeedback();
      } catch (err) {
        toast.error("Failed to delete feedback");
        console.error("Delete feedback error:", err);
      }
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      read: "bg-blue-100 text-blue-800",
      replied: "bg-green-100 text-green-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow p-4">
          <p className="text-sm text-gray-500">Average Rating</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold">
              {stats.averageRating.toFixed(1)}
            </span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={`${
                    star <= Math.round(stats.averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <p className="text-sm text-gray-500">Total Feedback</p>
          <p className="text-2xl font-bold">{stats.totalFeedback}</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <p className="text-sm text-gray-500">Pending Reply</p>
          <p className="text-2xl font-bold text-yellow-600">
            {stats.pendingCount}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <p className="text-sm text-gray-500">Replied</p>
          <p className="text-2xl font-bold text-green-600">
            {stats.repliedCount}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {["all", "pending", "replied"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === status
                ? "bg-amber-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {feedback.map((item) => (
          <div key={item._id} className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={`${
                          star <= item.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  {getStatusBadge(item.status)}
                </div>
                <h4 className="font-bold text-lg">{item.title}</h4>
                <p className="text-gray-600 mt-2">{item.message}</p>
                <div className="mt-3 text-sm text-gray-500">
                  <p>
                    From: {item.userName} ({item.userEmail})
                  </p>
                  <p>Date: {new Date(item.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-2">
                {item.status !== "replied" && (
                  <button
                    onClick={() => {
                      setSelectedFeedback(item);
                      setShowReplyModal(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Reply"
                  >
                    <Mail size={18} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {item.adminReply && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-sm font-medium text-green-800 mb-1 flex items-center gap-2">
                  <CheckCircle size={14} /> Admin Response:
                </p>
                <p className="text-gray-700">{item.adminReply.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Replied on{" "}
                  {new Date(item.adminReply.repliedAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        ))}

        {feedback.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow">
            <p className="text-gray-500">No feedback found</p>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold mb-4">Reply to Feedback</h3>
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 font-medium">
                From: {selectedFeedback?.userName}
              </p>
              <p className="text-gray-800 mt-1">{selectedFeedback?.message}</p>
            </div>
            <form onSubmit={handleReply}>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                rows={4}
                placeholder="Type your reply here..."
                className="w-full p-2 border rounded-lg mb-4"
                required
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition"
                >
                  Send Reply
                </button>
                <button
                  type="button"
                  onClick={() => setShowReplyModal(false)}
                  className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackManager;
