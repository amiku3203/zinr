import React, { useState } from 'react';
import { useGetOrderStatsQuery } from '../../store/features/orders/orderApi';
import { useGetMyRestaurantQuery } from '../../store/features/restorent/restoApi';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Clock,
  BarChart3,
  Calendar,
  PieChart,
  Activity,
  CheckCircle
} from 'lucide-react';

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  
  const { data: restaurantData } = useGetMyRestaurantQuery();
  const { data: statsData, isLoading } = useGetOrderStatsQuery({
    restaurantId: restaurantData?.data?._id,
    period: selectedPeriod
  });

  const getPeriodLabel = (period) => {
    const labels = {
      today: 'Today',
      week: 'This Week',
      month: 'This Month'
    };
    return labels[period] || period;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600',
      confirmed: 'text-blue-600',
      preparing: 'text-orange-600',
      ready: 'text-green-600',
      completed: 'text-gray-600',
      cancelled: 'text-red-600'
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-5 h-5" />,
      confirmed: <ShoppingCart className="w-5 h-5" />,
      preparing: <Activity className="w-5 h-5" />,
      ready: <TrendingUp className="w-5 h-5" />,
      completed: <CheckCircle className="w-5 h-5" />,
      cancelled: <TrendingDown className="w-5 h-5" />
    };
    return icons[status] || icons.pending;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Track your restaurant's performance and insights</p>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-400"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800">{statsData?.totalOrders || 0}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-400"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-800">₹{statsData?.totalRevenue || 0}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-400"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Order Value</p>
                <p className="text-2xl font-bold text-gray-800">
                  ₹{statsData?.totalOrders > 0 ? Math.round(statsData.totalRevenue / statsData.totalOrders) : 0}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-400"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Period</p>
                <p className="text-2xl font-bold text-gray-800">{getPeriodLabel(selectedPeriod)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Order Status Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status Breakdown</h3>
            <div className="space-y-4">
              {statsData?.stats?.map((stat, index) => (
                <div key={stat._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${getStatusColor(stat._id)} bg-opacity-10`}>
                      {getStatusIcon(stat._id)}
                    </div>
                    <span className="font-medium text-gray-700 capitalize">{stat._id}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{stat.count}</p>
                    <p className="text-sm text-gray-500">₹{stat.totalAmount}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue by Status</h3>
            <div className="space-y-4">
              {statsData?.stats?.map((stat, index) => (
                <div key={stat._id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize text-gray-600">{stat._id}</span>
                    <span className="font-medium">₹{stat.totalAmount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${statsData.totalRevenue > 0 ? (stat.totalAmount / statsData.totalRevenue) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800">Order Growth</h4>
              <p className="text-2xl font-bold text-blue-600">
                {statsData?.totalOrders > 0 ? '+' : ''}{statsData?.totalOrders || 0}
              </p>
              <p className="text-sm text-gray-600">orders this period</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800">Revenue Growth</h4>
              <p className="text-2xl font-bold text-green-600">
                ₹{statsData?.totalRevenue || 0}
              </p>
              <p className="text-sm text-gray-600">total revenue</p>
            </div>

            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <BarChart3 className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800">Average Order</h4>
              <p className="text-2xl font-bold text-yellow-600">
                ₹{statsData?.totalOrders > 0 ? Math.round(statsData.totalRevenue / statsData.totalOrders) : 0}
              </p>
              <p className="text-sm text-gray-600">per order</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center">
              <ShoppingCart className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">View Orders</span>
            </button>
            
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center">
              <BarChart3 className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">Export Data</span>
            </button>
            
            <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors text-center">
              <PieChart className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">Generate Report</span>
            </button>
            
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-center">
              <Activity className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">Real-time Updates</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
