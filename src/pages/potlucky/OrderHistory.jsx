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
  CreditCard,
  Smartphone,
  Phone,
  Mail,
  X
} from 'lucide-react';
import { apiGetUserOrders, apiCancelOrder } from '../../services/potlucky';
import { apiCreatePayment } from '../../services/payment';
import Swal from 'sweetalert2';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReview, setShowReview] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(null);
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
      paymentStatus: apiOrder.payment?.status || 'pending',
      paymentMethod: apiOrder.payment?.method || apiOrder.paymentMethod,
      meal: {
        id: apiOrder.meal._id || apiOrder.meal.id,
        name: apiOrder.meal.mealName || apiOrder.meal.name,
        chef: apiOrder.meal.createdBy ? 
          `${apiOrder.meal.createdBy.firstName} ${apiOrder.meal.createdBy.lastName}` : 
          'Unknown Chef',
        chefRating: 4.5,
        image: apiOrder.meal.photos?.[0] || 'https://via.placeholder.com/400x300'
      },
      quantity: apiOrder.quantity,
      totalAmount: apiOrder.totalPrice,
      deliveryFee: 0,
      finalAmount: apiOrder.totalPrice,
      deliveryAddress: 'Pickup at chef location',
      estimatedDelivery: apiOrder.pickupTime,
      actualDelivery: apiOrder.status === 'delivered' ? apiOrder.updatedAt : null,
      specialInstructions: apiOrder.notes || '',
      reviewed: false,
      userRating: null,
      userReview: null,
      canReorder: apiOrder.status === 'delivered',
      canReview: apiOrder.status === 'delivered',
      canPay: apiOrder.payment?.status === 'pending' || apiOrder.payment?.status === 'failed',
      fullOrderData: apiOrder
    };
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.meal.chef.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeFilter !== 'all') {
      filtered = filtered.filter(order => order.status === activeFilter);
    }

    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredOrders(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'preparing': return <ChefHat className="w-4 h-4" />;
      case 'ready': return <Package className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
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
    window.location.href = `/dashboard/potlucky/browse/${order.meal.id}`;
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await apiCancelOrder(orderId, 'User requested cancellation');
      await fetchOrders();
    } catch (error) {
      console.error('Failed to cancel order:', error);
    }
  };

  const handleReview = (orderId) => {
    setShowReview(orderId);
  };

  const handlePayNow = (order) => {
    setShowPaymentModal(order);
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
        <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
          {filteredOrders.length} orders
        </div>
      </div>

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
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">#{order.orderNumber}</h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.date)} at {formatTime(order.date)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                    {order.paymentStatus === 'pending' && order.paymentMethod !== 'cash' && (
                      <div className="px-3 py-1 rounded-full text-xs font-medium border bg-yellow-100 text-yellow-800 border-yellow-200">
                        Payment Pending
                      </div>
                    )}
                    {order.paymentStatus === 'failed' && (
                      <div className="px-3 py-1 rounded-full text-xs font-medium border bg-red-100 text-red-800 border-red-200">
                        Payment Failed
                      </div>
                    )}
                  </div>
                </div>

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
                  </div>
                </div>

                {order.specialInstructions && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Special Instructions:</span> {order.specialInstructions}
                    </p>
                  </div>
                )}

                <div className="flex space-x-2">
                  {order.canPay && (
                    <button
                      onClick={() => handlePayNow(order)}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Pay Now</span>
                    </button>
                  )}
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

      {showReview && (
        <ReviewModal
          order={orders.find(o => o.id === showReview)}
          onClose={() => setShowReview(null)}
          onSubmit={async (orderId, rating, review) => {
            setOrders(orders.map(order => 
              order.id === orderId 
                ? { ...order, reviewed: true, userRating: rating, userReview: review, canReview: false }
                : order
            ));
            setShowReview(null);
          }}
        />
      )}

      {showPaymentModal && (
        <PaymentModal
          order={showPaymentModal}
          onClose={() => setShowPaymentModal(null)}
          onSuccess={fetchOrders}
        />
      )}
    </div>
  );
};

const ReviewModal = ({ order, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating && review.trim()) {
      setLoading(true);
      try {
        await onSubmit(order.id, rating, review);
      } catch (error) {
        console.error('Failed to submit review:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Review Your Order</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
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

const PaymentModal = ({ order, onClose, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [momoDetails, setMomoDetails] = useState({ phone: '', provider: 'mtn' });
  const [loading, setLoading] = useState(false);

  const momoProviders = [
    { value: 'mtn', label: 'MTN Mobile Money' },
    { value: 'vodafone', label: 'Vodafone Cash' },
    { value: 'airteltigo', label: 'AirtelTigo Money' }
  ];

  const handlePayment = async () => {
    if (!paymentMethod) return;

    if (paymentMethod === 'momo' && !momoDetails.phone.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please enter your mobile money number',
        confirmButtonColor: '#ea580c'
      });
      return;
    }

    setLoading(true);

    try {
      const paymentPayload = {
        orderId: order.id,
        method: paymentMethod
      };

      if (paymentMethod === 'momo') {
        paymentPayload.momo = {
          phone: momoDetails.phone.trim(),
          provider: momoDetails.provider
        };
      }

      const paymentResponse = await apiCreatePayment(paymentPayload);

      if (paymentMethod === 'card') {
        if (paymentResponse.authorizationUrl) {
          window.open(paymentResponse.authorizationUrl, '_blank', 'width=600,height=600');
          
          Swal.fire({
            title: 'Complete Your Payment',
            html: `
              <div class="text-left">
                <p class="mb-3">A new window has opened for payment.</p>
                <p class="mb-2"><strong>Order:</strong> #${order.orderNumber}</p>
                <p class="mb-2"><strong>Reference:</strong> ${paymentResponse.paymentReference}</p>
                <p class="mb-3">After completing payment, you can close this window.</p>
              </div>
            `,
            icon: 'info',
            confirmButtonColor: '#10b981',
            confirmButtonText: 'Payment Completed'
          });
        }
      } else if (paymentMethod === 'momo') {
        await Swal.fire({
          icon: 'info',
          title: 'Mobile Money Payment Initiated',
          text: `Please check your phone for a payment prompt. Reference: ${paymentResponse.order.payment.reference}`,
          confirmButtonColor: '#10b981'
        });
      }

      onClose();
      onSuccess();

    } catch (error) {
      console.error('Payment failed:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: error.response?.data?.message || 'Failed to process payment. Please try again.',
        confirmButtonColor: '#ea580c'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Complete Payment</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Order:</span>
            <span className="font-medium">#{order.orderNumber}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Meal:</span>
            <span className="font-medium">{order.meal.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-bold text-lg">¢{order.finalAmount}</span>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <label className="flex items-center p-4 border rounded-xl cursor-pointer transition-all hover:border-gray-400">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="sr-only"
            />
            <CreditCard className={`w-5 h-5 mr-3 ${paymentMethod === 'card' ? 'text-orange-600' : 'text-gray-400'}`} />
            <span className={`font-medium ${paymentMethod === 'card' ? 'text-orange-900' : 'text-gray-700'}`}>
              Credit/Debit Card
            </span>
            {paymentMethod === 'card' && (
              <CheckCircle className="w-5 h-5 text-orange-600 ml-auto" />
            )}
          </label>

          <label className="flex items-center p-4 border rounded-xl cursor-pointer transition-all hover:border-gray-400">
            <input
              type="radio"
              name="paymentMethod"
              value="momo"
              checked={paymentMethod === 'momo'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="sr-only"
            />
            <Smartphone className={`w-5 h-5 mr-3 ${paymentMethod === 'momo' ? 'text-orange-600' : 'text-gray-400'}`} />
            <span className={`font-medium ${paymentMethod === 'momo' ? 'text-orange-900' : 'text-gray-700'}`}>
              Mobile Money
            </span>
            {paymentMethod === 'momo' && (
              <CheckCircle className="w-5 h-5 text-orange-600 ml-auto" />
            )}
          </label>
        </div>

        {paymentMethod === 'momo' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              Mobile Money Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provider
                </label>
                <select
                  value={momoDetails.provider}
                  onChange={(e) => setMomoDetails(prev => ({ ...prev, provider: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {momoProviders.map((provider) => (
                    <option key={provider.value} value={provider.value}>
                      {provider.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Money Number
                </label>
                <input
                  type="tel"
                  value={momoDetails.phone}
                  onChange={(e) => setMomoDetails(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="0241234567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the number registered with your mobile money account
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={loading || !paymentMethod || (paymentMethod === 'momo' && !momoDetails.phone.trim())}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-all ${
            loading || !paymentMethod || (paymentMethod === 'momo' && !momoDetails.phone.trim())
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-orange-600 text-white hover:bg-orange-700'
          }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              <span>Pay ¢{order.finalAmount}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default OrderHistory;