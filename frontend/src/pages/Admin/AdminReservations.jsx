import { format } from "date-fns";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import apiClient from "../../services/api/apiClient";

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await apiClient.get("/reservations");
      setReservations(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch reservations");
      console.error("Fetch reservations error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateReservationStatus = async (id, status) => {
    try {
      await apiClient.patch(`/reservations/${id}/status`, { status });
      toast.success(`Reservation ${status}`);
      fetchReservations();
    } catch (error) {
      toast.error("Failed to update status");
      console.error("Update reservation status error:", error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      seated: "bg-blue-100 text-blue-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
      no_show: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const filteredReservations =
    filter === "all"
      ? reservations
      : reservations.filter((r) => r.status === filter);

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
          Reservation Management
        </h2>
        <div className="flex gap-2 flex-wrap">
          {[
            "all",
            "pending",
            "confirmed",
            "seated",
            "completed",
            "cancelled",
          ].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-full text-sm capitalize ${
                filter === status
                  ? "bg-coffee-500 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredReservations.map((res, index) => (
          <motion.div
            key={res._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{res.name}</h3>
                <p className="text-sm text-gray-500">
                  {res.email} | {res.phone}
                </p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(res.status)}`}
              >
                {res.status}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">
                  {format(new Date(res.date), "MMM dd, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium">{res.time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Guests</p>
                <p className="font-medium">{res.guests} people</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium">
                  {format(new Date(res.createdAt), "MMM dd, yyyy")}
                </p>
              </div>
            </div>

            {res.specialRequests && (
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-gray-500">Special Requests</p>
                <p className="text-sm">{res.specialRequests}</p>
              </div>
            )}

            {res.status !== "completed" && res.status !== "cancelled" && (
              <div className="flex gap-2 pt-3 border-t">
                <select
                  onChange={(e) =>
                    updateReservationStatus(res._id, e.target.value)
                  }
                  value={res.status}
                  className="px-3 py-1 border rounded-lg text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirm</option>
                  <option value="seated">Seated</option>
                  <option value="completed">Complete</option>
                  <option value="cancelled">Cancel</option>
                </select>
              </div>
            )}
          </motion.div>
        ))}

        {filteredReservations.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <p className="text-gray-500">No reservations found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReservations;
