import React, { useState, useEffect, useRef } from 'react';
import { useGetMyRestaurantQuery } from '../../store/features/restorent/restoApi';
import { useGetRestaurantOrdersQuery, useUpdateOrderStatusMutation } from '../../store/features/orders/orderApi';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../../context/SocketContext';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Package, 
  Truck, 
  Star,
  Bell,
  TrendingUp,
  DollarSign,
  Users,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Zap
} from 'lucide-react';

const RestaurantDashboard = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [newOrderNotification, setNewOrderNotification] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    preparingOrders: 0,
    readyOrders: 0
  });

  const { data: restaurantData } = useGetMyRestaurantQuery();
  const { data: ordersData, isLoading, refetch } = useGetRestaurantOrdersQuery({
    restaurantId: restaurantData?.data?._id,
    status: selectedStatus
  });

  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const audioRef = useRef(null);
  const { socket, isConnected, joinRestaurant, leaveRestaurant } = useSocket();

  // Initialize socket connection
  useEffect(() => {
    if (restaurantData?.data?._id) {
      const newSocket = io('http://localhost:5000');
      
      newSocket.on('connect', () => {
        setIsConnected(true);
        newSocket.emit('join-restaurant', restaurantData.data._id);
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      newSocket.on('new-order', (data) => {
        console.log('New order received:', data);
        setNewOrderNotification(data.order);
        playNotificationSound();
        refetch(); // Refresh orders list
      });

      newSocket.on('order-updated', (data) => {
        console.log('Order updated:', data);
        refetch(); // Refresh orders list
      });

      setSocket(newSocket);

      return () => {
        newSocket.emit('leave-restaurant', restaurantData.data._id);
        newSocket.disconnect();
      };
    }
  }, [restaurantData?.data?._id, refetch]);

  // Update orders state when data changes
  useEffect(() => {
    if (ordersData?.orders) {
      setOrders(ordersData.orders);
      updateStats(ordersData.orders);
    }
  }, [ordersData]);

  // Play notification sound
  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  // Update statistics
  const updateStats = (ordersList) => {
    const stats = {
      totalOrders: ordersList.length,
      totalRevenue: ordersList.reduce((sum, order) => sum + order.totalAmount, 0),
      pendingOrders: ordersList.filter(order => order.status === 'pending').length,
      confirmedOrders: ordersList.filter(order => order.status === 'confirmed').length,
      preparingOrders: ordersList.filter(order => order.status === 'preparing').length,
      readyOrders: ordersList.filter(order => order.status === 'ready').length
    };
    setStats(stats);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({
        orderId,
        status: newStatus,
        estimatedTime: newStatus === 'confirmed' ? parseInt(estimatedTime) : undefined
      });
      setSelectedOrder(null);
      setEstimatedTime('');
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      preparing: 'bg-orange-100 text-orange-800 border-orange-200',
      ready: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      confirmed: <CheckCircle className="w-4 h-4" />,
      preparing: <Package className="w-4 h-4" />,
      ready: <Truck className="w-4 h-4" />,
      completed: <Star className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />
    };
    return icons[status] || icons.pending;
  };

  const filteredOrders = orders.filter(order => 
    selectedStatus === 'all' || order.status === selectedStatus
  );

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
        {/* Header with Connection Status */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {restaurantData?.data?.name} - Live Dashboard
              </h1>
              <p className="text-gray-600">Real-time order management and monitoring</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Connection Status */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm font-medium">
                  {isConnected ? 'Live' : 'Disconnected'}
                </span>
              </div>
              
              {/* Refresh Button */}
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        </motion.div>

        {/* Real-time Stats Cards */}
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
                <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="w-6 h-6 text-blue-600" />
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
                <p className="text-2xl font-bold text-gray-800">₹{stats.totalRevenue}</p>
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
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-800">{stats.pendingOrders}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
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
                <p className="text-sm font-medium text-gray-600">Ready Orders</p>
                <p className="text-2xl font-bold text-gray-800">{stats.readyOrders}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Truck className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-gray-600">Real-time updates enabled</span>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">#{order.orderNumber}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status}</span>
                  </span>
                </div>
                <p className="text-sm opacity-90 mt-1">
                  {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>

              {/* Order Content */}
              <div className="p-4">
                {/* Customer Info */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {order.customer.name}
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {order.customer.phone}
                    </div>
                    {order.customer.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {order.customer.email}
                      </div>
                    )}
                    {order.tableNumber && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Table {order.tableNumber}
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">Order Items:</h5>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="flex-1">
                          <span className="font-medium">{item.quantity}x</span> {item.menuItem.name}
                        </span>
                        <span className="text-gray-600">₹{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total and Actions */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-gray-800">
                      Total: ₹{order.totalAmount}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="w-full bg-yellow-400 text-white py-2 rounded-lg hover:bg-yellow-500 transition-colors font-medium"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Orders will appear here in real-time when customers place them.
            </p>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Update Order #{selectedOrder.orderNumber}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Status
                  </label>
                  <select
                    onChange={(e) => {
                      if (e.target.value === 'confirmed') {
                        setEstimatedTime('');
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  >
                    {selectedOrder.status === 'pending' && (
                      <>
                        <option value="confirmed">Confirm Order</option>
                        <option value="cancelled">Cancel Order</option>
                      </>
                    )}
                    {selectedOrder.status === 'confirmed' && (
                      <>
                        <option value="preparing">Start Preparing</option>
                        <option value="cancelled">Cancel Order</option>
                      </>
                    )}
                    {selectedOrder.status === 'preparing' && (
                      <>
                        <option value="ready">Mark Ready</option>
                        <option value="cancelled">Cancel Order</option>
                      </>
                    )}
                    {selectedOrder.status === 'ready' && (
                      <option value="completed">Mark Completed</option>
                    )}
                  </select>
                </div>
                
                {selectedOrder.status === 'pending' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Time (minutes)
                    </label>
                    <input
                      type="number"
                      value={estimatedTime}
                      onChange={(e) => setEstimatedTime(e.target.value)}
                      placeholder="e.g., 20"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const newStatus = document.querySelector('select').value;
                    handleStatusUpdate(selectedOrder._id, newStatus);
                  }}
                  className="flex-1 px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  Update
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* New Order Notification */}
      <AnimatePresence>
        {newOrderNotification && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6" />
              <div>
                <h4 className="font-semibold">New Order!</h4>
                <p className="text-sm opacity-90">
                  Order #{newOrderNotification.orderNumber} received
                </p>
              </div>
            </div>
            <button
              onClick={() => setNewOrderNotification(null)}
              className="absolute top-2 right-2 text-white opacity-70 hover:opacity-100"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Audio Element for Notifications */}
      <audio ref={audioRef} preload="auto">
        <source src="/notification.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default RestaurantDashboard;
