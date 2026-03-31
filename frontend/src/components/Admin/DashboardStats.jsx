import {
  Clock,
  Coffee,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";

const DashboardStats = ({ stats, loading, darkMode }) => {
  const statCards = [
    {
      title: "Total Orders",
      value: loading ? "..." : stats.totalOrders || 0,
      icon: ShoppingBag,
      color: "bg-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Total Revenue",
      value: loading ? "..." : `${stats.totalRevenue || 0} ETB`,
      icon: DollarSign,
      color: "bg-green-500",
      bgColor: "bg-green-100 dark:bg-green-900",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Total Users",
      value: loading ? "..." : stats.totalUsers || 0,
      icon: Users,
      color: "bg-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Menu Items",
      value: loading ? "..." : stats.totalMenuItems || 0,
      icon: Coffee,
      color: "bg-amber-500",
      bgColor: "bg-amber-100 dark:bg-amber-900",
      textColor: "text-amber-600 dark:text-amber-400",
    },
    {
      title: "Today's Orders",
      value: loading ? "..." : stats.todayOrders || 0,
      icon: Clock,
      color: "bg-orange-500",
      bgColor: "bg-orange-100 dark:bg-orange-900",
      textColor: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Today's Revenue",
      value: loading ? "..." : `${stats.todayRevenue || 0} ETB`,
      icon: TrendingUp,
      color: "bg-teal-500",
      bgColor: "bg-teal-100 dark:bg-teal-900",
      textColor: "text-teal-600 dark:text-teal-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
      {statCards.map((card, index) => (
        <div
          key={index}
          className={`rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                {card.title}
              </p>
              <h4
                className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
              >
                {card.value}
              </h4>
            </div>
            <div className={`${card.bgColor} p-3 rounded-full`}>
              <card.icon className={card.textColor} size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
