import { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, PlusCircle, CheckCircle, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import AddFoodForm from '../components/AddFoodForm';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, pendingOrders: 0 });
  const [loading, setLoading] = useState(true); // Now we will use this!

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [ordersRes, statsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/orders', { headers }),
          axios.get('http://localhost:5000/api/orders/stats', { headers })
        ]);

        setOrders(ordersRes.data.data);
        setStats(statsRes.data.stats);
      } catch (err) {
        console.error("Error fetching admin data", err);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, [activeTab]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-amber-900 text-white p-6 fixed h-full">
        <h2 className="text-2xl font-bold mb-8 italic">Yesekela Admin</h2>
        <button 
          onClick={() => setActiveTab('orders')} 
          className={`w-full flex items-center gap-2 p-3 rounded-lg mb-2 transition ${activeTab === 'orders' ? 'bg-amber-700' : 'hover:bg-amber-800'}`}
        >
          <Package size={20} /> Orders
        </button>
        <button 
          onClick={() => setActiveTab('add')} 
          className={`w-full flex items-center gap-2 p-3 rounded-lg transition ${activeTab === 'add' ? 'bg-amber-700' : 'hover:bg-amber-800'}`}
        >
          <PlusCircle size={20} /> Add Menu Item
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-8">
        
        {/* STATS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-green-500">
            <div className="flex justify-between items-center mb-2">
               <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
               <TrendingUp className="text-green-500" size={20} />
            </div>
            <h4 className="text-3xl font-bold text-gray-800">{loading ? '...' : `${stats.totalRevenue} ETB`}</h4>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-amber-500">
            <div className="flex justify-between items-center mb-2">
               <p className="text-gray-500 text-sm font-medium">Total Orders</p>
               <Package className="text-amber-500" size={20} />
            </div>
            <h4 className="text-3xl font-bold text-gray-800">{loading ? '...' : stats.totalOrders}</h4>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-red-500">
            <div className="flex justify-between items-center mb-2">
               <p className="text-gray-500 text-sm font-medium">Pending Payments</p>
               <AlertCircle className="text-red-500" size={20} />
            </div>
            <h4 className="text-3xl font-bold text-gray-800">{loading ? '...' : stats.pendingOrders}</h4>
          </div>
        </div>

        {/* DYNAMIC CONTENT with Loading State */}
        {activeTab === 'orders' ? (
          <div className="bg-white rounded-2xl shadow p-6 min-h-[400px] flex flex-col">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Recent Orders</h3>
            
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-amber-900">
                <Loader2 className="animate-spin mb-2" size={40} />
                <p className="font-medium">Fetching orders from DBU servers...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b text-gray-400">
                      <th className="pb-4">Order ID</th>
                      <th className="pb-4">Customer</th>
                      <th className="pb-4">Total</th>
                      <th className="pb-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id} className="border-b hover:bg-gray-50 transition">
                        <td className="py-4 font-mono text-sm">#{order._id.slice(-6)}</td>
                        <td className="py-4 font-medium">{order.user?.name || 'Guest'}</td>
                        <td className="py-4 font-bold text-amber-900">{order.totalPrice} ETB</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {order.isPaid ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <AddFoodForm />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;