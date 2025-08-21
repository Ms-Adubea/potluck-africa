import React, { useState, useEffect } from "react";
import {
  Clock,
  Phone,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChefHat,
  Package,
} from "lucide-react";
import { apiGetChefOrders, apiUpdateOrderStatus } from "../../services/potchef";
import { useNotificationContext } from "../../contexts/NotificationContext";
import { showBrowserNotification } from "../../utils/notificationUtils";


const ChefOrders = () => {
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { fetchUnreadCount } = useNotificationContext

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await apiGetChefOrders(page);
        setOrders(data.orders);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching chef orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const updatedOrder = await apiUpdateOrderStatus(orderId, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: updatedOrder.status }
            : order
        )
      );

 // Show browser notification for status updates
      showBrowserNotification(
        `Order ${newStatus}`,
        {
          body: `Order #${orderId.slice(-8)} has been marked as ${newStatus.toLowerCase()}`,
          icon: '/icons/icon-192x192.png'
        }
      );

// Refresh notification count in case there are related notifications
      fetchUnreadCount();

    } catch (error) {
      console.error(`Error updating order ${orderId}:`, error);
      alert("Failed to update order status. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "preparing":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "ready":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
      case "delivered":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      case "preparing":
        return <ChefHat className="w-4 h-4" />;
      case "ready":
        return <Package className="w-4 h-4" />;
      case "completed":
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "all") return true;
    return order.status.toLowerCase() === activeFilter.toLowerCase();
  });

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filterOptions = [
    { value: "all", label: "All Orders", count: orders.length },
    {
      value: "pending",
      label: "Pending",
      count: orders.filter((o) => o.status.toLowerCase() === "pending").length,
    },
    {
      value: "preparing",
      label: "Preparing",
      count: orders.filter((o) => o.status.toLowerCase() === "preparing").length,
    },
    {
      value: "ready",
      label: "Ready",
      count: orders.filter((o) => o.status.toLowerCase() === "ready").length,
    },
    {
      value: "completed",
      label: "Completed",
      count: orders.filter((o) => o.status.toLowerCase() === "completed" || o.status.toLowerCase() === "delivered").length,
    },
    {
      value: "cancelled",
      label: "Cancelled",
      count: orders.filter((o) => o.status.toLowerCase() === "cancelled").length,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
          {filteredOrders.length} orders
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto space-x-2 pb-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setActiveFilter(option.value)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === option.value
                ? "bg-orange-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {option.label}
            {option.count > 0 && (
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeFilter === option.value
                    ? "bg-white bg-opacity-20 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {option.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-500">
              {activeFilter === "all"
                ? "No orders yet"
                : `No ${activeFilter} orders`}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      #{order._id.slice(-8)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Ordered on {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">
                      {order.buyer.firstName} {order.buyer.lastName}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {order.buyer.phone}
                    </span>
                  </div>
                </div>

                {/* Meal Info */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">
                      {order.meal.name || `Meal ID: ${order.meal._id.slice(-8)}`}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        Qty: {order.quantity}
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="w-2 text-green-600">¢</span>
                        <span className="font-semibold text-green-600">
                          {order.totalPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                  {order.notes && (
                    <p className="text-sm text-gray-600 italic">
                      Note: {order.notes}
                    </p>
                  )}
                </div>

                {/* Pickup Info */}
                <div className="flex items-start space-x-2 mb-3">
                  <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">
                      Pickup scheduled for {formatDate(order.pickupTime)} at {formatTime(order.pickupTime)}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {order.status.toLowerCase() === "pending" && (
                    <>
                      <button
                        onClick={() => updateOrderStatus(order._id, "Preparing")}
                        className="flex-1 bg-orange-400 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-orange-500 transition-colors"
                      >
                        Accept & Start Cooking
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order._id, "Cancelled")}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {order.status.toLowerCase() === "preparing" && (
                    <button
                      onClick={() => updateOrderStatus(order._id, "Ready")}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Mark as Ready
                    </button>
                  )}
                  {order.status.toLowerCase() === "ready" && (
                    <button
                      onClick={() => updateOrderStatus(order._id, "Delivered")}
                      className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                    >
                      Mark as Delivered
                    </button>
                  )}
                  {(order.status.toLowerCase() === "delivered" ||
                    order.status.toLowerCase() === "cancelled") && (
                    <div className="flex-1 text-center py-2 text-sm text-gray-500">
                      Order {order.status.toLowerCase()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            page === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
        >
          Previous
        </button>

        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            page === totalPages
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ChefOrders;