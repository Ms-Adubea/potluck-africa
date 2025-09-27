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
import Swal from 'sweetalert2'; // Import SweetAlert2

const ChefOrders = () => {
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 🔧 FIXED: Added parentheses to useNotificationContext()
  const { fetchUnreadCount } = useNotificationContext();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await apiGetChefOrders(page);
        
        // Validate response structure
        if (!data) {
          throw new Error('No data received from server');
        }
        
        const ordersArray = data.orders || data.data || data || [];
        const totalPagesCount = data.totalPages || Math.ceil((data.total || ordersArray.length) / 10);
        
        setOrders(Array.isArray(ordersArray) ? ordersArray : []);
        setTotalPages(totalPagesCount);
        
      } catch (error) {
        console.error("Error fetching chef orders:", error);
        setError(error.message || 'Failed to fetch orders');
        setOrders([]);
        
        // Show SweetAlert error
        Swal.fire({
          icon: 'error',
          title: 'Failed to Load Orders',
          text: error.response?.status === 500 
            ? 'Server error occurred. Please check with your backend partner or try again later.'
            : error.message || 'Failed to fetch orders',
          confirmButtonColor: '#ef4444'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Show loading toast
      const loadingToast = Swal.fire({
        title: 'Updating Order...',
        text: `Setting status to ${newStatus}`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const updatedOrder = await apiUpdateOrderStatus(orderId, newStatus);
      
      // Update local state
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

      // 🔧 FIXED: Properly handle fetchUnreadCount with error handling
      try {
        await fetchUnreadCount();
      } catch (notificationError) {
        console.warn('Failed to refresh notification count:', notificationError);
        // Don't fail the whole operation if notification count fails
      }

      // Close loading toast and show success
      loadingToast.close();
      
      // Show success alert
      Swal.fire({
        icon: 'success',
        title: 'Order Updated!',
        text: `Order #${orderId.slice(-8)} has been marked as ${newStatus}`,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
        timerProgressBar: true
      });

    } catch (error) {
      console.error(`Error updating order ${orderId}:`, error);
      
      // Show detailed error message
      let errorTitle = "Failed to Update Order";
      let errorText = "Please try again.";
      
      if (error.response?.status === 500) {
        errorText = "Server error occurred while updating order. Please try again or contact support.";
      } else if (error.response?.status === 404) {
        errorText = "Order not found. It may have been deleted or you don't have permission to modify it.";
      } else if (error.response?.status === 403) {
        errorText = "Access denied. You don't have permission to update this order.";
      } else if (error.message) {
        errorText = error.message;
      }

      Swal.fire({
        icon: 'error',
        title: errorTitle,
        text: errorText,
        confirmButtonColor: '#ef4444'
      });
    }
  };

  // Confirmation dialog for order actions
  const confirmOrderAction = async (orderId, newStatus, actionText) => {
    const result = await Swal.fire({
      title: `${actionText}?`,
      text: `Are you sure you want to ${actionText.toLowerCase()} this order?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${actionText}`,
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      await updateOrderStatus(orderId, newStatus);
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
    try {
      return new Date(dateString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "Invalid time";
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
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
        <span className="ml-3 text-gray-600">Loading orders...</span>
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
                      {order.buyer?.firstName || 'Unknown'} {order.buyer?.lastName || 'Customer'}
                    </span>
                  </div>
                  {order.buyer?.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {order.buyer.phone}
                      </span>
                    </div>
                  )}
                </div>

                {/* Meal Info */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">
                      {order.meal?.mealName || order.meal?.name || order.meal?.title || `Meal ID: ${order.meal?._id?.slice(-8) || 'Unknown'}`}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        Qty: {order.quantity || 0}
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="w-2 text-green-600">¢</span>
                        <span className="font-semibold text-green-600">
                          {order.totalPrice || 0}
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
                {order.pickupTime && (
                  <div className="flex items-start space-x-2 mb-3">
                    <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">
                        Pickup scheduled for {formatDate(order.pickupTime)} at {formatTime(order.pickupTime)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons with confirmations */}
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
                        onClick={() => confirmOrderAction(order._id, "Cancelled", "Decline Order")}
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
                      onClick={() => updateOrderStatus(order._id, "Delivering")}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Start Delivery
                    </button>
                  )}
                  {order.status.toLowerCase() === "delivering" && (
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