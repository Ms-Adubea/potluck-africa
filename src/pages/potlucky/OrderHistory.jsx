import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Clock, 
  MapPin, 
  Star, 
  ChefHat, 
  Package, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw,
  MessageSquare,
  Receipt,
  Calendar,
  Truck,
  User
} from 'lucide-react';
import { apiGetUserOrders, apiCancelOrder } from '../../services/potlucky';
import Reviews from './Reviews';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReview, setShowReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchTerm, activeFilter, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiGetUserOrders();
      
      // Transform API response to match component expectations
      const transformedOrders = response.orders?.map(transformOrderData) || [];
      setOrders(transformedOrders);
      setFilteredOrders(transformedOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const transformOrderData = (apiOrder) => {
    return {
      id: apiOrder._id || apiOrder.id,
      orderNumber: `PL${apiOrder._id?.slice(-6).toUpperCase() || 'UNKNOWN'}`,
      date: apiOrder.createdAt,
      status: apiOrder.status.toLowerCase(),
      meal: {
        id: apiOrder.meal._id || apiOrder.meal.id,
        name: apiOrder.meal.mealName || apiOrder.meal.name,
        chef: apiOrder.meal.createdBy ? 
          `${apiOrder.meal.createdBy.firstName} ${apiOrder.meal.createdBy.lastName}` : 
          'Unknown Chef',
        chefRating: 4.5, // Default since not provided in API
        image: apiOrder.meal.photos?.[0] || 'https://via.placeholder.com/400x300'
      },
      quantity: apiOrder.quantity,
      totalAmount: apiOrder.totalPrice,
      deliveryFee: 0, // Not provided in API
      finalAmount: apiOrder.totalPrice,
      deliveryAddress: 'Pickup at chef location', // Since it's pickup-based
      estimatedDelivery: apiOrder.pickupTime,
      actualDelivery: apiOrder.status === 'delivered' ? apiOrder.updatedAt : null,
      specialInstructions: apiOrder.notes || '',
      paymentMethod: 'Mobile Money', // Default since not provided
      reviewed: false, // Would need separate API call to check
      userRating: null,
      userReview: null,
      canReorder: apiOrder.status === 'delivered',
      canReview: apiOrder.status === 'delivered',
      fullOrderData: apiOrder
    };
  };

  const filterOrders = () => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.meal.chef.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(order => order.status === activeFilter);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredOrders(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'preparing':
        return <ChefHat className="w-4 h-4" />;
      case 'ready':
        return <Package className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleReorder = (order) => {
    // Navigate to meal page for reordering
    window.location.href = `/dashboard/potlucky/browse/${order.meal.id}`;
  };

  const handleCancelOrder = async (orderId, reason = 'User requested cancellation') => {
    try {
      await apiCancelOrder(orderId, reason);
      // Refresh orders after cancellation
      await fetchOrders();
    } catch (error) {
      console.error('Failed to cancel order:', error);
      // Add error notification
    }
  };

  const handleReview = (orderId) => {
    setShowReview(orderId);
  };

  const getFilterOptions = () => [
    { value: 'all', label: 'All Orders', count: orders.length },
    { value: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
    { value: 'preparing', label: 'Preparing', count: orders.filter(o => o.status === 'preparing').length },
    { value: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { value: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading orders</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={fetchOrders}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const filterOptions = getFilterOptions();

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
        <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
          {filteredOrders.length} orders
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by order number, meal, or chef..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto space-x-2 pb-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setActiveFilter(option.value)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === option.value
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {option.label}
            {option.count > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeFilter === option.value
                  ? 'bg-white bg-opacity-20 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
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
            <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'You haven\'t placed any orders yet'}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Order Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">#{order.orderNumber}</h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.date)} at {formatTime(order.date)}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </div>

                {/* Meal Info */}
                <div className="flex items-start space-x-3 mb-4">
                  <img
                    src={order.meal.image}
                    alt={order.meal.name}
                    className="w-16 h-16 rounded-lg object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{order.meal.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <ChefHat className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{order.meal.chef}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{order.meal.chefRating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Quantity: {order.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">¢{order.finalAmount}</p>
                    <p className="text-sm text-gray-500">Total</p>
                  </div>
                </div>

                {/* Pickup Info */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-start space-x-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {order.status === 'delivered' ? 
                          `Picked up at ${formatTime(order.actualDelivery)}` :
                          `Pickup by ${formatTime(order.estimatedDelivery)}`
                        }
                      </span>
                    </div>
                    {order.status === 'delivered' && order.actualDelivery && (
                      <div className="flex items-center space-x-1">
                        <Package className="w-4 h-4" />
                        <span>
                          {new Date(order.actualDelivery) <= new Date(order.estimatedDelivery) ? 
                            'On time' : 'Late pickup'
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Special Instructions */}
                {order.specialInstructions && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Special Instructions:</span> {order.specialInstructions}
                    </p>
                  </div>
                )}

                {/* User Review */}
                {order.reviewed && order.userReview && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < order.userRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">Your Review</span>
                    </div>
                    <p className="text-sm text-gray-700">{order.userReview}</p>
                  </div>
                )}

                {/* Order Summary */}
                <div className="border-t pt-3 mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Subtotal ({order.quantity}x)</span>
                    <span>¢{order.totalAmount}</span>
                  </div>
                  {order.deliveryFee > 0 && (
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Delivery Fee</span>
                      <span>¢{order.deliveryFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-medium text-gray-900">
                    <span>Total</span>
                    <span>¢{order.finalAmount}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {order.canReorder && (
                    <button
                      onClick={() => handleReorder(order)}
                      className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Reorder</span>
                    </button>
                  )}
                  {order.canReview && !order.reviewed && (
                    <button
                      onClick={() => handleReview(order.id)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Review</span>
                    </button>
                  )}
                  {(order.status === 'pending' || order.status === 'preparing') && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="px-4 py-2 border border-red-300 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      {showReview && (
        <ReviewModal
          order={orders.find(o => o.id === showReview)}
          onClose={() => setShowReview(null)}
          onSubmit={async (orderId, rating, review) => {
            // Update the order in state to reflect the review
            setOrders(orders.map(order => 
              order.id === orderId 
                ? { ...order, reviewed: true, userRating: rating, userReview: review, canReview: false }
                : order
            ));
            setShowReview(null);
          }}
        />
      )}
    </div>
  );
};

// Review Modal Component
const ReviewModal = ({ order, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating && review.trim()) {
      setLoading(true);
      try {
        // Here you would typically call an API to submit the review
        // For now, we'll just call the parent's onSubmit
        await onSubmit(order.id, rating, review);
      } catch (error) {
        console.error('Failed to submit review:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Review Your Order</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <img
            src={order.meal.image}
            alt={order.meal.name}
            className="w-full h-32 object-cover rounded-lg mb-3"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x120?text=No+Image';
            }}
          />
          <h4 className="font-medium">{order.meal.name}</h4>
          <p className="text-sm text-gray-600">by {order.meal.chef}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <button
                key={i}
                onClick={() => setRating(i + 1)}
                className={`w-8 h-8 transition-colors ${
                  i < rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                }`}
              >
                <Star className="w-full h-full fill-current" />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">({rating} star{rating !== 1 ? 's' : ''})</span>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience with this meal..."
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!rating || !review.trim() || loading}
            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;