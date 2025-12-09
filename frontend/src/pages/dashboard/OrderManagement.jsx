import { useState, useEffect } from "react";
import {
  useGetRestaurantOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../store/features/orders/orderApi";
import { useGetMyRestaurantQuery } from "../../store/features/restorent/restoApi";
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Truck,
  Star,
  Filter,
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Hash,
} from "lucide-react";

const OrderManagement = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState("");
  const [newOrderStatus, setNewOrderStatus] = useState("");

  const { data: restaurantData } = useGetMyRestaurantQuery();
  const {
    data: ordersData,
    isLoading,
    refetch,
  } = useGetRestaurantOrdersQuery({
    restaurantId: restaurantData?.data?._id,
    status: selectedStatus,
  });

  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  // Set default status when modal opens
  useEffect(() => {
    if (selectedOrder) {
      // Set the first available option based on current status
      const statusMap = {
        pending: "confirmed",
        confirmed: "preparing",
        preparing: "ready",
        ready: "completed",
      };
      setNewOrderStatus(statusMap[selectedOrder.status] || "");
    }
  }, [selectedOrder]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({
        orderId,
        status: newStatus,
        estimatedTime:
          newStatus === "confirmed" ? parseInt(estimatedTime) : undefined,
      });
      refetch();
      setSelectedOrder(null);
      setEstimatedTime("");
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      confirmed: "bg-blue-100 text-blue-800 border-blue-200",
      preparing: "bg-orange-100 text-orange-800 border-orange-200",
      ready: "bg-green-100 text-green-800 border-green-200",
      completed: "bg-gray-100 text-gray-800 border-gray-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
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
      cancelled: <XCircle className="w-4 h-4" />,
    };
    return icons[status] || icons.pending;
  };

  const getPaymentStatusColor = (paymentStatus) => {
    const colors = {
      paid: "text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-medium",
      pending:
        "text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs font-medium",
      failed:
        "text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs font-medium",
      refunded:
        "text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs font-medium",
    };
    return colors[paymentStatus] || colors.pending;
  };

  const filteredOrders =
    ordersData?.orders?.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.phone.includes(searchTerm) ||
        order.queueNumber.toString().includes(searchTerm)
    ) || [];

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
          <h1 className="text-3xl font-bold text-white mb-2">
            Order Management
          </h1>
          <p className="text-gray-300">Manage and track all customer orders</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {["pending", "confirmed", "preparing", "ready"].map((status) => {
            const count =
              ordersData?.orders?.filter((order) => order.status === status)
                .length || 0;
            return (
              <motion.div
                key={status}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay:
                    status === "pending"
                      ? 0
                      : status === "confirmed"
                      ? 0.1
                      : status === "preparing"
                      ? 0.2
                      : 0.3,
                }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-700/50 border-l-4 border-l-yellow-400 rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 capitalize">
                      {status}
                    </p>
                    <p className="text-2xl font-bold text-white">{count}</p>
                  </div>
                  <div className="p-3 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
                    <div className="text-yellow-400">
                      {getStatusIcon(status)}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Filters and Search */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-700/50 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by order number, customer name, phone, or queue number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 w-full"
                />
              </div>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 bg-gray-700/50 border border-gray-600/50 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 [&>option]:bg-gray-800 [&>option]:text-white [&>option]:py-2"
              >
                <option value="all" className="bg-gray-800 text-white">
                  All Status
                </option>
                <option value="pending" className="bg-gray-800 text-white">
                  Pending
                </option>
                <option value="confirmed" className="bg-gray-800 text-white">
                  Confirmed
                </option>
                <option value="preparing" className="bg-gray-800 text-white">
                  Preparing
                </option>
                <option value="ready" className="bg-gray-800 text-white">
                  Ready
                </option>
                <option value="completed" className="bg-gray-800 text-white">
                  Completed
                </option>
                <option value="cancelled" className="bg-gray-800 text-white">
                  Cancelled
                </option>
              </select>
            </div>

            <button
              onClick={() => refetch()}
              className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-700/50 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Queue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total & Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800/30 divide-y divide-gray-700/50">
                {filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-700/30 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-white">
                          #{order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                        {order.tableNumber && (
                          <p className="text-sm text-gray-400">
                            Table {order.tableNumber}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Hash className="w-4 h-4 text-yellow-400 mr-2" />
                        <span className="text-lg font-bold text-yellow-400">
                          #{order.queueNumber}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-white">
                          {order.customer.name}
                        </p>
                        <div className="flex items-center text-sm text-gray-400 mt-1">
                          <Phone className="w-4 h-4 mr-1" />
                          {order.customer.phone}
                        </div>
                        {order.customer.email && (
                          <div className="flex items-center text-sm text-gray-400 mt-1">
                            <Mail className="w-4 h-4 mr-1" />
                            {order.customer.email}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-sm text-white mb-1">
                            <span className="font-medium text-yellow-400">
                              {item.quantity}x
                            </span>{" "}
                            {item.menuItem.name}
                            {item.specialInstructions && (
                              <p className="text-xs text-gray-400 italic ml-4">
                                Note: {item.specialInstructions}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-white">
                        ₹{order.totalAmount}
                      </p>
                      <div className="mt-1">
                        <span
                          className={getPaymentStatusColor(order.paymentStatus)}
                        >
                          {order.paymentStatus === "paid" ? "Paid" : "Pending"}
                        </span>
                      </div>
                      {order.paymentMethod && (
                        <p className="text-xs text-gray-400 mt-1 capitalize">
                          {order.paymentMethod}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </span>
                      {order.estimatedTime && (
                        <p className="text-xs text-gray-400 mt-1">
                          Est: {order.estimatedTime} min
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                        }}
                        className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors duration-200"
                      >
                        Update Status
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-500" />
              <h3 className="mt-2 text-sm font-medium text-white">
                No orders found
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "Orders will appear here when customers place them."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600 rounded-2xl shadow-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-medium text-white mb-4">
              Update Order #{selectedOrder.orderNumber}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Status
                </label>
                <select
                  value={newOrderStatus}
                  onChange={(e) => {
                    setNewOrderStatus(e.target.value);
                    if (e.target.value === "confirmed") {
                      setEstimatedTime("");
                    }
                  }}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 [&>option]:bg-gray-800 [&>option]:text-white [&>option]:py-2"
                >
                  {selectedOrder.status === "pending" && (
                    <>
                      <option
                        value="confirmed"
                        className="bg-gray-800 text-white"
                      >
                        Confirm Order
                      </option>
                      <option
                        value="cancelled"
                        className="bg-gray-800 text-white"
                      >
                        Cancel Order
                      </option>
                    </>
                  )}
                  {selectedOrder.status === "confirmed" && (
                    <>
                      <option
                        value="preparing"
                        className="bg-gray-800 text-white"
                      >
                        Start Preparing
                      </option>
                      <option
                        value="cancelled"
                        className="bg-gray-800 text-white"
                      >
                        Cancel Order
                      </option>
                    </>
                  )}
                  {selectedOrder.status === "preparing" && (
                    <>
                      <option value="ready" className="bg-gray-800 text-white">
                        Mark Ready
                      </option>
                      <option
                        value="cancelled"
                        className="bg-gray-800 text-white"
                      >
                        Cancel Order
                      </option>
                    </>
                  )}
                  {selectedOrder.status === "ready" && (
                    <option
                      value="completed"
                      className="bg-gray-800 text-white"
                    >
                      Mark Completed
                    </option>
                  )}
                </select>
              </div>

              {selectedOrder.status === "pending" && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Estimated Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(e.target.value)}
                    placeholder="e.g., 20"
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setNewOrderStatus("");
                }}
                className="flex-1 px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newOrderStatus) {
                    handleStatusUpdate(selectedOrder._id, newOrderStatus);
                    setNewOrderStatus("");
                  }
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg"
              >
                Update
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
