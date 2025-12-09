import React, { useState } from "react";
import { useGetOrderStatsQuery } from "../../store/features/orders/orderApi";
import { useGetMyRestaurantQuery } from "../../store/features/restorent/restoApi";
import { motion } from "framer-motion";
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
  CheckCircle,
} from "lucide-react";

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("today");

  const { data: restaurantData } = useGetMyRestaurantQuery();
  const { data: statsData, isLoading } = useGetOrderStatsQuery({
    restaurantId: restaurantData?.data?._id,
    period: selectedPeriod,
  });

  const getPeriodLabel = (period) => {
    const labels = {
      today: "Today",
      week: "This Week",
      month: "This Month",
    };
    return labels[period] || period;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "text-yellow-400",
      confirmed: "text-blue-400",
      preparing: "text-orange-400",
      ready: "text-green-400",
      completed: "text-gray-400",
      cancelled: "text-red-400",
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
      cancelled: <TrendingDown className="w-5 h-5" />,
    };
    return icons[status] || icons.pending;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-t-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-700/50 rounded-2xl shadow-xl p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-gray-300">
                Track your restaurant's performance and insights
              </p>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 bg-gray-700/50 border border-gray-600/50 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 [&>option]:bg-gray-800 [&>option]:text-white [&>option]:py-2"
              >
                <option value="today" className="bg-gray-800 text-white">
                  Today
                </option>
                <option value="week" className="bg-gray-800 text-white">
                  This Week
                </option>
                <option value="month" className="bg-gray-800 text-white">
                  This Month
                </option>
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
            className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-700/50 border-l-4 border-l-blue-400 rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-white">
                  {statsData?.totalOrders || 0}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-full">
                <ShoppingCart className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-700/50 border-l-4 border-l-green-400 rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-white">
                  ₹{statsData?.totalRevenue || 0}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-700/50 border-l-4 border-l-yellow-400 rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Average Order Value
                </p>
                <p className="text-2xl font-bold text-white">
                  ₹
                  {statsData?.totalOrders > 0
                    ? Math.round(statsData.totalRevenue / statsData.totalOrders)
                    : 0}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full">
                <BarChart3 className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-700/50 border-l-4 border-l-purple-400 rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Period</p>
                <p className="text-2xl font-bold text-white">
                  {getPeriodLabel(selectedPeriod)}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full">
                <Calendar className="w-6 h-6 text-purple-400" />
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
            className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-700/50 rounded-2xl shadow-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              Order Status Breakdown
            </h3>
            <div className="space-y-4">
              {statsData?.stats?.map((stat, index) => (
                <div
                  key={stat._id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gray-700/50 border border-gray-600/30">
                      <div className={getStatusColor(stat._id)}>
                        {getStatusIcon(stat._id)}
                      </div>
                    </div>
                    <span className="font-medium text-gray-300 capitalize">
                      {stat._id}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">{stat.count}</p>
                    <p className="text-sm text-gray-400">₹{stat.totalAmount}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-700/50 rounded-2xl shadow-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              Revenue by Status
            </h3>
            <div className="space-y-4">
              {statsData?.stats?.map((stat, index) => (
                <div key={stat._id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize text-gray-300">{stat._id}</span>
                    <span className="font-medium text-white">
                      ₹{stat.totalAmount}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          statsData.totalRevenue > 0
                            ? (stat.totalAmount / statsData.totalRevenue) * 100
                            : 0
                        }%`,
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
          className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-700/50 rounded-2xl shadow-xl p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            Performance Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl">
              <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h4 className="font-semibold text-white">Order Growth</h4>
              <p className="text-2xl font-bold text-blue-400">
                {statsData?.totalOrders > 0 ? "+" : ""}
                {statsData?.totalOrders || 0}
              </p>
              <p className="text-sm text-gray-400">orders this period</p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
              <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h4 className="font-semibold text-white">Revenue Growth</h4>
              <p className="text-2xl font-bold text-green-400">
                ₹{statsData?.totalRevenue || 0}
              </p>
              <p className="text-sm text-gray-400">total revenue</p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl">
              <BarChart3 className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h4 className="font-semibold text-white">Average Order</h4>
              <p className="text-2xl font-bold text-yellow-400">
                ₹
                {statsData?.totalOrders > 0
                  ? Math.round(statsData.totalRevenue / statsData.totalOrders)
                  : 0}
              </p>
              <p className="text-sm text-gray-400">per order</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-700/50 rounded-2xl shadow-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 hover:border-blue-400/40 rounded-xl transition-all duration-300 text-center hover:shadow-lg">
              <ShoppingCart className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-300">
                View Orders
              </span>
            </button>

            <button className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:border-green-400/40 rounded-xl transition-all duration-300 text-center hover:shadow-lg">
              <BarChart3 className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-300">
                Export Data
              </span>
            </button>

            <button className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 hover:border-yellow-400/40 rounded-xl transition-all duration-300 text-center hover:shadow-lg">
              <PieChart className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-300">
                Generate Report
              </span>
            </button>

            <button className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-400/40 rounded-xl transition-all duration-300 text-center hover:shadow-lg">
              <Activity className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-300">
                Real-time Updates
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
