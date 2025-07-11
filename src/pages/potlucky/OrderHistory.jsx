import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
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
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal
} from 'lucide-react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReview, setShowReview] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  const mockOrders = [
    {
      id: 'ORD-001',
      orderNumber: 'PL2025001',
      date: '2025-01-15T10:30:00',
      status: 'delivered',
      meal: {
        name: 'Jollof Rice with Grilled Chicken',
        chef: 'Mama Akosua',
        chefRating: 4.9,
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop'
      },
      quantity: 2,
      totalAmount: 25.99,
      deliveryFee: 3.50,
      finalAmount: 29.49,
      deliveryAddress: '123 Main St, East Legon, Accra',
      estimatedDelivery: '2025-01-15T12:00:00',
      actualDelivery: '2025-01-15T11:45:00',
      specialInstructions: 'Extra spicy please, no onions',
      paymentMethod: 'Mobile Money',
      reviewed: true,
      userRating: 5,
      userReview: 'Absolutely delicious! The chicken was perfectly grilled and the jollof had amazing flavor.',
      canReorder: true,
      canReview: false
    },
    {
      id: 'ORD-002',
      orderNumber: 'PL2025002',
      date: '2025-01-14T14:20:00',
      status: 'delivered',
      meal: {
        name: 'Waakye with Fish',
        chef: 'Chef Kwame',
        chefRating: 4.7,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'
      },
      quantity: 1,
      totalAmount: 18.50,
      deliveryFee: 2.50,
      finalAmount: 21.00,
      deliveryAddress: '456 Oak Ave, Tema, Accra',
      estimatedDelivery: '2025-01-14T16:00:00',
      actualDelivery: '2025-01-14T15:50:00',
      specialInstructions: '',
      paymentMethod: 'Card',
      reviewed: false,
      userRating: null,
      userReview: null,
      canReorder: true,
      canReview: true
    },
    {
      id: 'ORD-003',
      orderNumber: 'PL2025003',
      date: '2025-01-13T19:15:00',
      status: 'cancelled',
      meal: {
        name: 'Banku with Tilapia',
        chef: 'Auntie Ama',
        chefRating: 4.8,
        image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop'
      },
      quantity: 2,
      totalAmount: 42.75,
      deliveryFee: 4.00,
      finalAmount: 46.75,
      deliveryAddress: '789 Pine Rd, Kumasi',
      estimatedDelivery: '2025-01-13T21:00:00',
      actualDelivery: null,
      specialInstructions: 'Please include extra pepper sauce',
      paymentMethod: 'Mobile Money',
      reviewed: false,
      userRating: null,
      userReview: null,
      canReorder: true,
      canReview: false,
      cancellationReason: 'Chef unavailable due to emergency'
    },
    {
      id: 'ORD-004',
      orderNumber: 'PL2025004',
      date: '2025-01-12T12:45:00',
      status: 'delivered',
      meal: {
        name: 'Red Red with Fried Plantain',
        chef: 'Sister Efua',
        chefRating: 4.6,
        image: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&h=300&fit=crop'
      },
      quantity: 1,
      totalAmount: 15.99,
      deliveryFee: 2.00,
      finalAmount: 17.99,
      deliveryAddress: '321 Cedar St, Accra',
      estimatedDelivery: '2025-01-12T14:15:00',
      actualDelivery: '2025-01-12T14:05:00',
      specialInstructions: '',
      paymentMethod: 'Mobile Money',
      reviewed: true,
      userRating: 4,
      userReview: 'Good food but could use more seasoning.',
      canReorder: true,
      canReview: false
    },
    {
      id: 'ORD-005',
      orderNumber: 'PL2025005',
      date: '2025-01-11T16:30:00',
      status: 'preparing',
      meal: {
        name: 'Fufu with Light Soup',
        chef: 'Chef Adjoa',
        chefRating: 4.8,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop'
      },
      quantity: 1,
      totalAmount: 28.50,
      deliveryFee: 3.00,
      finalAmount: 31.50,
      deliveryAddress: '654 Birch Ln, East Legon, Accra',
      estimatedDelivery: '2025-01-11T18:30:00',
      actualDelivery: null,
      specialInstructions: 'Please make it extra spicy',
      paymentMethod: 'Card',
      reviewed: false,
      userRating: null,
      userReview: null,
      canReorder: false,
      canReview: false
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchTerm, activeFilter, orders]);

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
    // Implement reorder functionality
    console.log('Reordering:', order);
    // This would typically add the meal back to cart or redirect to meal page
  };

  const handleReview = (orderId) => {
    setShowReview(orderId);
  };

  const submitReview = (orderId, rating, review) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, reviewed: true, userRating: rating, userReview: review, canReview: false }
        : order
    ));
    setShowReview(null);
  };

  const filterOptions = [
    { value: 'all', label: 'All Orders', count: orders.length },
    { value: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
    { value: 'preparing', label: 'Preparing', count: orders.filter(o => o.status === 'preparing').length },
    { value: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

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

                {/* Delivery Info */}
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
                          `Delivered at ${formatTime(order.actualDelivery)}` :
                          `Expected by ${formatTime(order.estimatedDelivery)}`
                        }
                      </span>
                    </div>
                    {order.status === 'delivered' && order.actualDelivery && (
                      <div className="flex items-center space-x-1">
                        <Truck className="w-4 h-4" />
                        <span>
                          {new Date(order.actualDelivery) <= new Date(order.estimatedDelivery) ? 
                            'On time' : 'Late delivery'
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

                {/* Cancellation Reason */}
                {order.status === 'cancelled' && order.cancellationReason && (
                  <div className="mb-4 p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-700">
                      <span className="font-medium">Cancellation Reason:</span> {order.cancellationReason}
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
                    <span>Subtotal</span>
                    <span>¢{order.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Delivery Fee</span>
                    <span>¢{order.deliveryFee}</span>
                  </div>
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
                  {order.canReview && (
                    <button
                      onClick={() => handleReview(order.id)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Review</span>
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      Track Order
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
          onSubmit={submitReview}
        />
      )}
    </div>
  );
};

// Review Modal Component
const ReviewModal = ({ order, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  const handleSubmit = () => {
    if (rating && review.trim()) {
      onSubmit(order.id, rating, review);
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
                className={`w-8 h-8 ${
                  i < rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                <Star className="w-full h-full fill-current" />
              </button>
            ))}
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
            disabled={!rating || !review.trim()}
            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;