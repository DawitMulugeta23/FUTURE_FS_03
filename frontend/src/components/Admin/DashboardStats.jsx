import { Coffee, DollarSign, ShoppingBag, Users } from "lucide-react";

const DashboardStats = ({ stats, loading }) => {
  const statCards = [
    {
      title: "Total Orders",
      value: loading ? "..." : stats.totalOrders || 0,
      icon: ShoppingBag,
      color: "bg-blue-500",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: "Total Revenue",
      value: loading ? "..." : `${stats.totalRevenue || 0} ETB`,
      icon: DollarSign,
      color: "bg-green-500",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      title: "Total Users",
      value: loading ? "..." : stats.totalUsers || 0,
      icon: Users,
      color: "bg-purple-500",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      title: "Menu Items",
      value: loading ? "..." : stats.totalMenuItems || 0,
      icon: Coffee,
      color: "bg-amber-500",
      bgColor: "bg-amber-100",
      textColor: "text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">
                {card.title}
              </p>
              <h4 className="text-2xl font-bold text-gray-800">{card.value}</h4>
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
