import React, { useState, useEffect } from 'react';
import { 
  Search, Clock, MapPin, ChefHat, Package, CheckCircle, 
  XCircle, AlertCircle, RefreshCw, Receipt,
  CreditCard, Smartphone, Phone, Banknote, X, Copy, ShoppingCart,
  Mail, Loader2
} from 'lucide-react';
import Swal from 'sweetalert2';
import { apiGetUserOrders, apiCancelOrder } from '../../services/potlucky';
import { apiCreatePayment, apiVodafoneMomo, checkPaymentStatus } from '../../services/payment';
import { getCurrentUser } from '../../services/auth';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(null);
  const [loading, setLoading] = useState(true);

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
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Orders',
        text: 'Could not retrieve your order history',
        confirmButtonColor: '#ea580c'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.meal?.mealName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeFilter !== 'all') {
      filtered = filtered.filter(order => {
        const status = order.status?.toLowerCase();
        if (activeFilter === 'active') {
          return ['pending', 'preparing', 'ready'].includes(status);
        }
        return status === activeFilter;
      });
    }

    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setFilteredOrders(filtered);
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: 'bg-yellow-500', icon: Clock, label: 'Pending' },
      preparing: { color: 'bg-blue-500', icon: ChefHat, label: 'Preparing' },
      ready: { color: 'bg-green-500', icon: Package, label: 'Ready' },
      delivered: { color: 'bg-emerald-500', icon: CheckCircle, label: 'Delivered' },
      cancelled: { color: 'bg-red-500', icon: XCircle, label: 'Cancelled' }
    };
    return configs[status?.toLowerCase()] || configs.pending;
  };

  const getPaymentStatusConfig = (payment) => {
    if (!payment) return null;
    
    if (payment.status === 'paid') {
      return { color: 'bg-green-500', label: 'Paid', icon: CheckCircle };
    }
    if (payment.method === 'cash' && payment.status === 'pending') {
      return { color: 'bg-blue-500', label: 'Cash on Pickup', icon: Banknote };
    }
    if (payment.status === 'pending') {
      return { color: 'bg-yellow-500', label: 'Payment Pending', icon: AlertCircle };
    }
    if (payment.status === 'failed') {
      return { color: 'bg-red-500', label: 'Payment Failed', icon: XCircle };
    }
    return null;
  };

  const handleReorder = (order) => {
    const mealId = order.meal?.id || order.meal?._id;
    if (mealId) {
      window.location.href = `/dashboard/potlucky/browse/${mealId}`;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Cannot Reorder',
        text: 'This meal is no longer available',
        confirmButtonColor: '#ea580c'
      });
    }
  };

  const handleCancelOrder = async (order) => {
    const result = await Swal.fire({
      title: 'Cancel Order?',
      text: 'Are you sure you want to cancel this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, cancel it',
      cancelButtonText: 'No, keep it'
    });

    if (result.isConfirmed) {
      try {
        await apiCancelOrder(order.id, 'Cancelled by customer');
        await fetchOrders();
        
        Swal.fire({
          icon: 'success',
          title: 'Order Cancelled',
          text: 'Your order has been cancelled successfully',
          confirmButtonColor: '#10b981',
          timer: 2000
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Cancellation Failed',
          text: error.response?.data?.message || 'Could not cancel order',
          confirmButtonColor: '#ea580c'
        });
      }
    }
  };

  const canPayNow = (order) => {
    const paymentStatus = order.payment?.status;
    const paymentMethod = order.payment?.method;
    return (paymentStatus === 'pending' || paymentStatus === 'failed') && paymentMethod !== 'cash';
  };

  const canCancel = (order) => {
    const status = order.status?.toLowerCase();
    return ['pending', 'preparing'].includes(status);
  };

  const canReorder = (order) => {
    return order.meal?.id || order.meal?._id;
  };

  const activeCount = orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status?.toLowerCase())).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-600 to-orange-500 px-4 pt-6 pb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Order History</h1>
            <p className="text-orange-100 text-sm">Track and manage all your orders</p>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-xl">
            <p className="text-2xl font-bold text-black">{orders.length}</p>
            <p className="text-xs text-orange-300">Orders</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-xl p-3">
            <p className="text-xl font-bold text-black">{orders.length}</p>
            <p className="text-xs text-orange-300">All Orders</p>
          </div>
          <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-xl p-3">
            <p className="text-xl font-bold text-black">{activeCount}</p>
            <p className="text-xs text-orange-300">Active</p>
          </div>
          <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-xl p-3">
            <p className="text-xl font-bold text-black">{orders.filter(o => o.status?.toLowerCase() === 'delivered').length}</p>
            <p className="text-xs text-orange-300">Delivered</p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by order ID or meal name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {[
            { value: 'all', label: 'All Orders' },
            { value: 'active', label: 'Active' },
            { value: 'delivered', label: 'Delivered' },
            { value: 'cancelled', label: 'Cancelled' }
          ].map((filter) => {
            const count = filter.value === 'all' ? orders.length :
                         filter.value === 'active' ? activeCount :
                         orders.filter(o => o.status?.toLowerCase() === filter.value).length;
            
            return (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeFilter === filter.value
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                {filter.label} <span className={`ml-1 ${activeFilter === filter.value ? 'text-orange-200' : 'text-gray-500'}`}>({count})</span>
              </button>
            );
          })}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Receipt className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500 mb-6 text-sm">
                {searchTerm ? 'Try adjusting your search' : 'Start ordering delicious meals!'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => window.location.href = '/dashboard/potlucky/browse'}
                  className="bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Browse Meals
                </button>
              )}
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const paymentConfig = getPaymentStatusConfig(order.payment);
              const StatusIcon = statusConfig.icon;

              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-gray-50 p-4 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Order ID</p>
                        <p className="font-mono font-bold text-sm">#{order.id?.slice(-8).toUpperCase()}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1 ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {paymentConfig && (
                      <div className={`mt-2 inline-flex px-3 py-1 rounded-full text-xs font-bold text-white items-center gap-1 ${paymentConfig.color}`}>
                        <paymentConfig.icon className="w-3 h-3" />
                        {paymentConfig.label}
                      </div>
                    )}
                  </div>

                  {/* Meal Info */}
                  <div className="p-4">
                    <div className="flex gap-3 mb-3">
                      <img
                        src={order.meal?.photos?.[0] || 'https://via.placeholder.com/80'}
                        alt={order.meal?.mealName}
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/80'}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 mb-1 text-sm">{order.meal?.mealName}</h3>
                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                          <ChefHat className="w-3 h-3 text-orange-500" />
                          <span className="truncate">
                            {order.chef ? `${order.chef.firstName} ${order.chef.lastName}` : 'Chef'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-600">Qty: <span className="font-semibold text-gray-900">{order.quantity}</span></p>
                          <p className="text-lg font-bold text-orange-600">¢{order.totalPrice}</p>
                        </div>
                      </div>
                    </div>

                    {/* Pickup Time */}
                    {order.pickupTime && (
                      <div className="bg-orange-50 rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2 text-xs">
                          <Clock className="w-4 h-4 text-orange-600" />
                          <span className="text-gray-700">
                            <span className="font-semibold">Pickup:</span>{' '}
                            {new Date(order.pickupTime).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {order.notes && (
                      <div className="mb-3 text-xs">
                        <p className="text-gray-600">
                          <span className="font-semibold">Note:</span> {order.notes}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {canPayNow(order) && (
                        <button
                          onClick={() => setShowPaymentModal(order)}
                          className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-bold flex items-center justify-center gap-1"
                        >
                          <CreditCard className="w-4 h-4" />
                          Pay Now
                        </button>
                      )}
                      
                      {canReorder(order) && (
                        <button
                          onClick={() => handleReorder(order)}
                          className="flex-1 bg-orange-600 text-white py-2 px-3 rounded-lg text-sm font-bold flex items-center justify-center gap-1"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Reorder
                        </button>
                      )}

                      {canCancel(order) && (
                        <button
                          onClick={() => handleCancelOrder(order)}
                          className="px-3 py-2 border-2 border-red-300 text-red-700 rounded-lg text-sm font-bold"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Payment Modal */}
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

const PaymentModal = ({ order, onClose, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [momoDetails, setMomoDetails] = useState({ phone: '', provider: 'mtn' });
  const [customerEmail, setCustomerEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [voucherRequired, setVoucherRequired] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [ussdCode, setUssdCode] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [pollingInProgress, setPollingInProgress] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser?.email) {
      setCustomerEmail(currentUser.email);
    }
  }, []);

  const momoProviders = [
    { value: 'mtn', label: 'MTN Mobile Money' },
    { value: 'vod', label: 'Vodafone Cash' },
    { value: 'atl', label: 'AirtelTigo Money' }
  ];

  const handleMomoPaymentResponse = async (paymentResponse) => {
    const authType = paymentResponse.authorizationType || 
                    (paymentResponse.data?.status === 'send_otp' ? 'voucher' : 
                     paymentResponse.data?.status === 'pay_offline' ? 'offline' : 'online');

    setPaymentReference(paymentResponse.paymentReference || paymentResponse.data?.reference);

    if (authType === 'voucher') {
      setUssdCode(paymentResponse.displayText || '*170*10#');
      setVoucherRequired(true);
      
      await Swal.fire({
        icon: 'info',
        title: 'Vodafone Payment',
        html: `
          <div class="text-left">
            <p class="font-semibold mb-2">Step 1: Dial ${paymentResponse.displayText || '*170*10#'}</p>
            <p class="text-sm mb-3">You'll receive a voucher code</p>
            <p class="font-semibold">Step 2: Enter the voucher below</p>
          </div>
        `,
        confirmButtonColor: '#ea580c'
      });
    } else if (authType === 'offline') {
      await Swal.fire({
        icon: 'info',
        title: 'Mobile Money Payment',
        html: `
          <div class="text-left">
            <p class="mb-3">${paymentResponse.displayText || 'Check your phone to approve payment'}</p>
            <p class="text-sm">Reference: ${paymentResponse.paymentReference}</p>
          </div>
        `,
        confirmButtonColor: '#10b981'
      });

      setPollingInProgress(true);
      const pollResult = await checkPaymentStatus(paymentResponse.paymentReference);
      setPollingInProgress(false);
      
      if (pollResult.status === 'success') {
        await Swal.fire({
          icon: 'success',
          title: 'Payment Successful!',
          confirmButtonColor: '#10b981'
        });
        onSuccess();
        onClose();
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Payment Failed',
          text: pollResult.message || 'Payment not completed.',
          confirmButtonColor: '#ea580c'
        });
        onClose();
      }
    }
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      Swal.fire({ icon: 'error', title: 'Select Payment Method', confirmButtonColor: '#ea580c' });
      return;
    }

    if ((paymentMethod === 'card' || paymentMethod === 'momo') && !customerEmail.trim()) {
      Swal.fire({ icon: 'error', title: 'Email Required', confirmButtonColor: '#ea580c' });
      return;
    }

    if (paymentMethod === 'momo' && !momoDetails.phone.trim()) {
      Swal.fire({ icon: 'error', title: 'Phone Required', confirmButtonColor: '#ea580c' });
      return;
    }

    setLoading(true);

    try {
      const paymentPayload = {
        orderId: order.id,
        method: paymentMethod,
        email: customerEmail.trim()
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
          window.open(paymentResponse.authorizationUrl, '_blank');
          await Swal.fire({
            title: 'Complete Payment',
            html: `Payment window opened. Reference: ${paymentResponse.paymentReference}`,
            icon: 'info',
            confirmButtonColor: '#10b981'
          });
        }
        onClose();
        onSuccess();
      } else if (paymentMethod === 'momo') {
        await handleMomoPaymentResponse(paymentResponse);
      }
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: error.message || 'Could not process payment',
        confirmButtonColor: '#ea580c'
      });
    } finally {
      if (!voucherRequired) setLoading(false);
    }
  };

  const handleVoucherSubmit = async () => {
    if (!voucherCode.trim()) {
      Swal.fire({ icon: 'error', title: 'Enter Voucher', confirmButtonColor: '#ea580c' });
      return;
    }

    setLoading(true);

    try {
      await apiVodafoneMomo({
        reference: paymentReference,
        voucherCode: voucherCode.trim()
      });

      await Swal.fire({
        icon: 'success',
        title: 'Payment Processing',
        confirmButtonColor: '#10b981',
        timer: 2000
      });

      onClose();
      onSuccess();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Voucher Failed',
        text: error.message || 'Invalid voucher',
        confirmButtonColor: '#ea580c'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center rounded-t-3xl">
          <h3 className="text-xl font-bold">{voucherRequired ? 'Enter Voucher' : 'Complete Payment'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {voucherRequired ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <p className="font-semibold text-blue-900 mb-2">Step 1: Dial USSD</p>
                <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                  <code className="text-lg font-bold">{ussdCode}</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(ussdCode);
                      Swal.fire({ icon: 'success', title: 'Copied!', timer: 1000, showConfirmButton: false });
                    }}
                    className="text-blue-600"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">Step 2: Enter Voucher</label>
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="Enter code"
                  maxLength="6"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-center text-xl font-mono"
                />
              </div>

              <button
                onClick={handleVoucherSubmit}
                disabled={loading || !voucherCode.trim()}
                className={`w-full py-3 rounded-xl font-bold ${
                  loading || !voucherCode.trim()
                    ? 'bg-gray-300 text-gray-500'
                    : 'bg-orange-600 text-white'
                }`}
              >
                {loading ? 'Submitting...' : 'Submit Voucher'}
              </button>
            </div>
          ) : (
            <>
              <div className="bg-orange-50 rounded-xl p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 text-sm">Order</span>
                  <span className="font-mono font-bold text-sm">#{order.id?.slice(-8)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 text-sm">Meal</span>
                  <span className="font-semibold text-sm">{order.meal?.mealName}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t-2 border-orange-200">
                  <span className="font-bold">Total</span>
                  <span className="text-2xl font-bold text-orange-600">¢{order.totalPrice}</span>
                </div>
              </div>

              {(paymentMethod === 'card' || paymentMethod === 'momo') && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                  />
                </div>
              )}

              <div className="space-y-3 mb-4">
                <p className="text-sm font-semibold">Select Payment Method</p>
                
                {[
                  { value: 'card', label: 'Card', icon: CreditCard },
                  { value: 'momo', label: 'Mobile Money', icon: Smartphone }
                ].map((method) => {
                  const Icon = method.icon;
                  return (
                    <label
                      key={method.value}
                      className={`flex items-center p-4 border-2 rounded-xl cursor-pointer ${
                        paymentMethod === method.value
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.value}
                        checked={paymentMethod === method.value}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <Icon className={`w-5 h-5 mr-3 ${paymentMethod === method.value ? 'text-orange-600' : 'text-gray-400'}`} />
                      <span className={`font-semibold ${paymentMethod === method.value ? 'text-orange-900' : 'text-gray-700'}`}>
                        {method.label}
                      </span>
                      {paymentMethod === method.value && (
                        <CheckCircle className="w-5 h-5 text-orange-600 ml-auto" />
                      )}
                    </label>
                  );
                })}
              </div>

              {paymentMethod === 'momo' && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Mobile Money Details
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Provider</label>
                      <select
                        value={momoDetails.provider}
                        onChange={(e) => setMomoDetails(prev => ({ ...prev, provider: e.target.value }))}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                      >
                        {momoProviders.map((provider) => (
                          <option key={provider.value} value={provider.value}>
                            {provider.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={momoDetails.phone}
                        onChange={(e) => setMomoDetails(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="0241234567"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {pollingInProgress && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center mb-4">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin mx-auto mb-2" />
                  <p className="text-blue-800 text-sm font-semibold">Waiting for payment...</p>
                  <p className="text-blue-600 text-xs">Complete payment on your phone</p>
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={loading || !paymentMethod || (paymentMethod === 'momo' && !momoDetails.phone.trim()) || ((paymentMethod === 'card' || paymentMethod === 'momo') && !customerEmail.trim())}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-lg ${
                  loading || !paymentMethod || (paymentMethod === 'momo' && !momoDetails.phone.trim()) || ((paymentMethod === 'card' || paymentMethod === 'momo') && !customerEmail.trim())
                    ? 'bg-gray-300 text-gray-500'
                    : 'bg-orange-600 text-white'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Pay ¢{order.totalPrice}</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;