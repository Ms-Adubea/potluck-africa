import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChefHat,
  Truck,
  MapPin,
  Phone,
  MessageCircle,
  Star,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import Swal from 'sweetalert2';

// Mock API functions
const apiGetOrderById = async (orderId) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    id: orderId,
    status: 'Preparing',
    meal: {
      mealName: 'Jollof Rice with Grilled Chicken',
      photos: ['https://via.placeholder.com/400x300?text=Jollof+Rice']
    },
    chef: {
      firstName: 'Chef',
      lastName: 'Akosua',
      phone: '+233241234567'
    },
    quantity: 2,
    totalPrice: 51.00,
    pickupTime: '2024-01-15T14:30:00Z',
    pickupLocation: 'East Legon, Accra',
    createdAt: '2024-01-15T13:00:00Z',
    acceptedAt: '2024-01-15T13:05:00Z',
    estimatedReadyTime: '2024-01-15T14:15:00Z',
    payment: {
      method: 'card',
      status: 'completed',
      reference: 'PAY_123456789'
    }
  };
};

const apiCancelOrder = async (orderId) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return { success: true, message: 'Order cancelled successfully' };
};

const OrderTracking = ({ orderId, onBack }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrder = async () => {
    try {
      setRefreshing(true);
      const orderData = await apiGetOrderById(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error('Error fetching order:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Failed to Load Order',
        text: 'Could not load order details. Please try again.',
        confirmButtonColor: '#ea580c'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const getStatusInfo = (status) => {
    const statusConfig = {
      'Pending': {
        icon: Clock,
        color: 'text-yellow-600 bg-yellow-100',
        title: 'Order Pending',
        description: 'Waiting for chef to accept your order'
      },
      'Preparing': {
        icon: ChefHat,
        color: 'text-blue-600 bg-blue-100',
        title: 'Being Prepared',
        description: 'Chef is preparing your delicious meal'
      },
      'Ready': {
        icon: CheckCircle,
        color: 'text-green-600 bg-green-100',
        title: 'Ready for Pickup',
        description: 'Your order is ready! Head to pickup location'
      },
      'Delivering': {
        icon: Truck,
        color: 'text-indigo-600 bg-indigo-100',
        title: 'Out for Delivery',
        description: 'Your order is on the way'
      },
      'Delivered': {
        icon: CheckCircle,
        color: 'text-green-600 bg-green-100',
        title: 'Delivered',
        description: 'Order completed successfully'
      },
      'Cancelled': {
        icon: XCircle,
        color: 'text-red-600 bg-red-100',
        title: 'Cancelled',
        description: 'This order has been cancelled'
      }
    };

    return statusConfig[status] || statusConfig['Pending'];
  };

  const getTimelineSteps = () => {
    const steps = [
      { key: 'placed', label: 'Order Placed', time: order?.createdAt },
      { key: 'accepted', label: 'Accepted by Chef', time: order?.acceptedAt },
      { key: 'preparing', label: 'Being Prepared', time: order?.acceptedAt },
      { key: 'ready', label: 'Ready for Pickup', time: order?.readyAt },
      { key: 'completed', label: 'Completed', time: order?.deliveredAt }
    ];

    const statusMap = {
      'Pending': 0,
      'Preparing': 2,
      'Ready': 3,
      'Delivering': 3,
      'Delivered': 4,
      'Cancelled': 0
    };

    const currentStep = statusMap[order?.status] || 0;
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentStep,
      active: index === currentStep,
      cancelled: order?.status === 'Cancelled' && index > 0
    }));
  };

  const handleCancelOrder = async () => {
    const result = await Swal.fire({
      title: 'Cancel Order?',
      html: `
        <div class="text-center">
          <p class="text-gray-600 mb-4">Are you sure you want to cancel this order?</p>
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p class="text-sm text-yellow-800">
              <strong>Note:</strong> If payment was made, it may take 3-5 business days for the refund to reflect in your account.
            </p>
          </div>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Cancel Order',
      cancelButtonText: 'Keep Order'
    });

    if (result.isConfirmed) {
      try {
        setCancelling(true);
        await apiCancelOrder(orderId);
        
        await Swal.fire({
          icon: 'success',
          title: 'Order Cancelled',
          text: 'Your order has been cancelled successfully.',
          confirmButtonColor: '#ea580c'
        });

        // Refresh order data
        await fetchOrder();
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Cancellation Failed',
          text: 'Could not cancel your order. Please try again or contact support.',
          confirmButtonColor: '#ea580c'
        });
      } finally {
        setCancelling(false);
      }
    }
  };

  const handleContactChef = () => {
    Swal.fire({
      title: 'Contact Chef',
      html: `
        <div class="text-center">
          <div class="mb-4">
            <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">${order?.chef?.firstName} ${order?.chef?.lastName}</h3>
          </div>
          <div class="space-y-3">
            <a href="tel:${order?.chef?.phone}" class="flex items-center justify-center space-x-2 bg-green-50 hover:bg-green-100 text-green-700 py-3 px-4 rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              <span>Call Now</span>
            </a>
            <button class="flex items-center justify-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-700 py-3 px-4 rounded-lg transition-colors w-full">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <span>Send Message</span>
            </button>
          </div>
        </div>
      `,
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        container: 'swal-contact-chef'
      }
    });
  };

  const canCancelOrder = () => {
    return order && ['Pending', 'Preparing'].includes(order.status);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Order not found</h3>
          <p className="text-gray-600 mb-6">This order might have been removed or doesn't exist.</p>
          <button
            onClick={onBack}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;
  const timelineSteps = getTimelineSteps();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-gray-900">Order #{order.id.slice(-6)}</h1>
            <p className="text-sm text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={fetchOrder}
            disabled={refreshing}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 text-gray-700 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Current Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${statusInfo.color} mb-4`}>
              <StatusIcon className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{statusInfo.title}</h2>
            <p className="text-gray-600">{statusInfo.description}</p>
          </div>

          {/* Estimated Time */}
          {order.status === 'Preparing' && order.estimatedReadyTime && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
              <div className="flex items-center space-x-2 text-orange-800">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">
                  Estimated ready time: {new Date(order.estimatedReadyTime).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </span>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-4">
            {timelineSteps.map((step, index) => (
              <div key={step.key} className="flex items-center space-x-4">
                <div className={`flex-shrink-0 w-4 h-4 rounded-full border-2 ${
                  step.completed 
                    ? 'bg-orange-600 border-orange-600' 
                    : step.cancelled
                    ? 'bg-gray-300 border-gray-300'
                    : 'border-gray-300'
                }`}>
                  {step.completed && (
                    <CheckCircle className="w-4 h-4 text-white -m-px" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${
                      step.completed ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </span>
                    {step.time && (
                      <span className="text-sm text-gray-500">
                        {new Date(step.time).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
          
          {/* Meal Info */}
          <div className="flex items-start space-x-4 mb-6">
            <img
              src={order.meal.photos[0]}
              alt={order.meal.mealName}
              className="w-20 h-20 rounded-xl object-cover"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{order.meal.mealName}</h4>
              <p className="text-sm text-gray-600 mt-1">Quantity: {order.quantity}x</p>
              <p className="text-lg font-bold text-orange-600 mt-2">¢{order.totalPrice.toFixed(2)}</p>
            </div>
          </div>

          {/* Pickup Details */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Pickup Time</p>
                <p className="text-sm text-gray-600">
                  {new Date(order.pickupTime).toLocaleString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Pickup Location</p>
                <p className="text-sm text-gray-600">{order.pickupLocation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chef Contact */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Chef Contact</h3>
            <button
              onClick={handleContactChef}
              className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contact</span>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {order.chef.firstName} {order.chef.lastName}
              </p>
              <p className="text-sm text-gray-600">{order.chef.phone}</p>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Method</span>
              <span className="font-medium text-gray-900 capitalize">
                {order.payment.method.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                order.payment.status === 'completed' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {order.payment.status}
              </span>
            </div>
            {order.payment.reference && (
              <div className="flex justify-between">
                <span className="text-gray-600">Reference</span>
                <span className="font-mono text-sm text-gray-900">{order.payment.reference}</span>
              </div>
            )}
            <div className="pt-2 border-t flex justify-between">
              <span className="font-semibold text-gray-900">Total Paid</span>
              <span className="font-bold text-lg text-green-600">¢{order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {canCancelOrder() && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-colors ${
                cancelling
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {cancelling ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Cancelling...</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5" />
                  <span>Cancel Order</span>
                </>
              )}
            </button>
          </div>
        )}

        {order.status === 'Delivered' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <button className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors">
              <Star className="w-5 h-5" />
              <span>Rate & Review</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;