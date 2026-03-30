import {
  FiCalendar,
  FiDollarSign,
  FiShoppingBag,
  FiStar,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

const DashboardStats = ({ stats, isLoading }) => {
  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: FiUsers,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: FiShoppingBag,
      color: "bg-green-500",
      change: "+8%",
    },
    {
      title: "Revenue",
      value: `$${stats?.totalRevenue?.toFixed(2) || "0"}`,
      icon: FiDollarSign,
      color: "bg-yellow-500",
      change: "+15%",
    },
    {
      title: "Menu Items",
      value: stats?.totalMenuItems || 0,
      icon: FiTrendingUp,
      color: "bg-purple-500",
      change: "+3",
    },
    {
      title: "Pending Reservations",
      value: stats?.pendingReservations || 0,
      icon: FiCalendar,
      color: "bg-orange-500",
      change: "Needs attention",
    },
    {
      title: "Pending Reviews",
      value: stats?.pendingReviews || 0,
      icon: FiStar,
      color: "bg-pink-500",
      change: "Approve",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-lg p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`${card.color} p-3 rounded-lg text-white`}>
              <card.icon size={24} />
            </div>
            <span className="text-sm text-green-500 bg-green-100 px-2 py-1 rounded-full">
              {card.change}
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
          <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;
