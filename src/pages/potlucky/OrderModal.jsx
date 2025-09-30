import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Minus, 
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  CreditCard,
  Smartphone,
  Banknote,
  Phone,
  Mail
} from 'lucide-react';
import Swal from 'sweetalert2';
import { apiCreateOrder } from '../../services/potlucky';
import { apiCreatePayment } from '../../services/payment';
import { getCurrentUser } from '../../services/auth';

const OrderModal = ({ meal, isOpen, onClose, onOrderSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [pickupTime, setPickupTime] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [momoDetails, setMomoDetails] = useState({
    phone: '',
    provider: 'mtn'
  });
  const [customerEmail, setCustomerEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);

  // Payment method options
  const paymentMethods = [
    { value: 'card', label: 'Credit/Debit Card', icon: CreditCard },
    { value: 'momo', label: 'Mobile Money', icon: Smartphone },
    { value: 'cash', label: 'Cash on Pickup', icon: Banknote },
  ];

  // Mobile money providers
  const momoProviders = [
    { value: 'mtn', label: 'MTN Mobile Money' },
    { value: 'vodafone', label: 'Vodafone Cash' },
    { value: 'airteltigo', label: 'AirtelTigo Money' }
  ];

  // Generate time slots for pickup - FIXED to be between 30-60 minutes from now
  useEffect(() => {
    if (isOpen) {
      const generateTimeSlots = () => {
        const slots = [];
        const now = new Date();
        const startTime = new Date(now.getTime() + 30 * 60000); // 30 minutes from now
        
        // Round to next 15-minute interval
        const minutesToAdd = (15 - (startTime.getMinutes() % 15)) % 15;
        startTime.setMinutes(startTime.getMinutes() + minutesToAdd);
        startTime.setSeconds(0, 0);
        
        // Calculate how many 15-minute slots fit within the 30-60 minute window
        const endTime = new Date(now.getTime() + 60 * 60000); // 60 minutes from now
        const maxSlots = Math.floor((endTime - startTime) / (15 * 60000)) + 1;
        
        // Generate slots within the 30-60 minute window
        for (let i = 0; i < maxSlots; i++) {
          const time = new Date(startTime.getTime() + (i * 15 * 60000));
          
          // Only add if within 60 minutes from original "now"
          if (time <= endTime) {
            slots.push({
              value: time.toISOString(),
              label: time.toLocaleString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })
            });
          }
        }
        return slots;
      };

      const slots = generateTimeSlots();
      setTimeSlots(slots);
      if (slots.length > 0 && !pickupTime) {
        setPickupTime(slots[0].value);
      }
    }
  }, [isOpen]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      const currentUser = getCurrentUser();

      setQuantity(1);
      setPickupTime('');
      setPaymentMethod('');
      setMomoDetails({ phone: '', provider: 'mtn' });
      setNotes('');
      setError('');

      // Pre-fill email from logged-in user
      if (currentUser?.email) {
        setCustomerEmail(currentUser.email);
      } else {
        setCustomerEmail('');
      }
    }
  }, [isOpen]);

  const validateForm = () => {
    if (!pickupTime) {
      setError('Please select a pickup time');
      return false;
    }

    if (!paymentMethod) {
      setError('Please select a payment method');
      return false;
    }

    // Email validation for card and momo payments
    if (paymentMethod === 'card' || paymentMethod === 'momo') {
      const emailToValidate = customerEmail.trim() || getCurrentUser()?.email || '';
      
      if (!emailToValidate) {
        setError('Please enter your email address for payment processing');
        return false;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailToValidate)) {
        setError('Please enter a valid email address');
        return false;
      }
    }

    // Validate mobile money details if momo is selected
    if (paymentMethod === 'momo') {
      if (!momoDetails.phone.trim()) {
        setError('Please enter your mobile money number');
        return false;
      }
      
      const phoneRegex = /^(\+233|0)[2-9]\d{8}$/;
      if (!phoneRegex.test(momoDetails.phone.trim())) {
        setError('Please enter a valid Ghanaian phone number');
        return false;
      }
      
      if (!momoDetails.provider) {
        setError('Please select your mobile money provider');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Show loading state
      const loadingSwal = Swal.fire({
        title: 'Processing Your Order',
        html: 'Please wait while we process your order...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Create order data according to your API
      const orderData = {
        meal: meal.id,
        quantity,
        pickupTime,
        paymentMethod,
        notes: notes.trim()
      };

      // Add mobile money details if payment method is momo
      if (paymentMethod === 'momo') {
        orderData.momo = {
          phone: momoDetails.phone.trim(),
          provider: momoDetails.provider
        };
      }

      // Create the order first
      console.log('Creating order with data:', orderData);
      const orderResponse = await apiCreateOrder(orderData);
      console.log('Order created successfully:', orderResponse);
      
      loadingSwal.close();

      // Handle different payment methods
      if (paymentMethod === 'cash') {
        // Cash payment - order is complete
        await Swal.fire({
          icon: 'success',
          title: 'Order Placed Successfully!',
          text: 'Your order has been placed. Pay when you pickup!',
          confirmButtonColor: '#10b981',
          timer: 2000,
          timerProgressBar: true
        });

        onOrderSuccess && onOrderSuccess(orderResponse.order, null);
        onClose();
        
      } else {
        // Card or Mobile Money payment
        try {
          // Create payment using corrected payload
          const paymentPayload = {
            orderId: orderResponse.order.id || orderResponse.order._id,
            method: paymentMethod
          };

          // Add momo details for mobile money
          if (paymentMethod === 'momo') {
            paymentPayload.momo = {
              phone: momoDetails.phone.trim(),
              provider: momoDetails.provider
            };
          }

          console.log('Creating payment with payload:', paymentPayload);
          
          const paymentResponse = await apiCreatePayment(paymentPayload);
          
          if (paymentMethod === 'card') {
            // Handle card payment with authorization URL
            if (paymentResponse.authorizationUrl) {
              // Show confirmation before redirecting
              await Swal.fire({
                title: 'Redirecting to Payment',
                text: 'You will be redirected to Paystack to complete your card payment.',
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#ea580c',
                confirmButtonText: 'Continue to Payment',
                cancelButtonText: 'Cancel'
              }).then((result) => {
                if (result.isConfirmed) {
                  // Open payment URL in new tab/window
                  window.open(paymentResponse.authorizationUrl, '_blank', 'width=600,height=600');
                  
                  // Show instructions to user
                  Swal.fire({
                    title: 'Complete Your Payment',
                    html: `
                      <div class="text-left">
                        <p class="mb-3">A new window has opened for payment.</p>
                        <p class="mb-2"><strong>Reference:</strong> ${paymentResponse.paymentReference}</p>
                        <p class="mb-3">After completing payment, you can close this window.</p>
                      </div>
                    `,
                    icon: 'info',
                    confirmButtonColor: '#10b981',
                    confirmButtonText: 'Payment Completed'
                  });
                }
              });
            }

          } else if (paymentMethod === 'momo') {
            // Handle mobile money payment
            if (paymentResponse.order.payment.reference) {
              await Swal.fire({
                icon: 'info',
                title: 'Mobile Money Payment Initiated',
                text: `Please check your phone for a payment prompt. Reference: ${paymentResponse.order.payment.reference}`,
                confirmButtonColor: '#10b981'
              });
            }

            onOrderSuccess && onOrderSuccess(orderResponse.order, paymentResponse);
            onClose();
          }
          
        } catch (paymentError) {
          console.error('Payment initialization failed:', paymentError);
          
          await Swal.fire({
            icon: 'warning',
            title: 'Order Placed, Payment Pending',
            text: 'Your order was created but payment initialization failed. You can complete payment later from your orders page.',
            confirmButtonColor: '#ea580c'
          });

          onOrderSuccess && onOrderSuccess(orderResponse.order, null);
          onClose();
        }
      }
      
      // Reset form
      setQuantity(1);
      setPickupTime('');
      setPaymentMethod('');
      setMomoDetails({ phone: '', provider: 'mtn' });
      setCustomerEmail('');
      setNotes('');
      
    } catch (error) {
      console.error('Order failed:', error);
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to place order. Please try again.';
      
      await Swal.fire({
        icon: 'error',
        title: 'Order Failed',
        text: errorMessage,
        confirmButtonColor: '#ea580c'
      });
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = meal ? meal.price * quantity : 0;

  if (!isOpen || !meal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="bg-white w-full max-h-[90vh] rounded-t-3xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Place Order</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Meal Summary */}
          <div className="flex items-start space-x-4 mb-6 p-4 bg-gray-50 rounded-xl">
            <img
              src={meal.image || (meal.photos && meal.photos[0]) || 'https://via.placeholder.com/80x80'}
              alt={meal.name || meal.mealName}
              className="w-20 h-20 rounded-lg object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
              }}
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{meal.name || meal.mealName}</h3>
              <p className="text-sm text-gray-600 mt-1">by {meal.chef?.name || `${meal.createdBy?.firstName} ${meal.createdBy?.lastName}`}</p>
              <div className="flex items-center space-x-2 mt-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{meal.location || meal.pickupLocation}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">¢{meal.price}</p>
              <p className="text-sm text-gray-500">per serving</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Customer Email - Show only for card and momo payments */}
            {(paymentMethod === 'card' || paymentMethod === 'momo') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                  {getCurrentUser()?.email && (
                    <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      ✓ Auto-filled
                    </span>
                  )}
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder={getCurrentUser()?.email || "your.email@example.com"}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Required for payment processing and order confirmation
                </p>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quantity
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={loading}
                    className="flex items-center justify-center w-10 h-10 rounded-md bg-white shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="font-semibold text-lg min-w-[3rem] text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={loading}
                    className="flex items-center justify-center w-10 h-10 rounded-md bg-white shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">¢{totalPrice.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Total</p>
                </div>
              </div>
            </div>

            {/* Pickup Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Calendar className="w-4 h-4 inline mr-2" />
                Pickup Time
              </label>
              <select
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="">Select pickup time</option>
                {timeSlots.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Pickup times between 30-60 minutes from now
              </p>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Method
              </label>
              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <label
                      key={method.value}
                      className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                        paymentMethod === method.value
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-300 hover:border-gray-400'
                      } ${loading ? 'pointer-events-none opacity-50' : ''}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={paymentMethod === method.value}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        disabled={loading}
                        className="sr-only"
                      />
                      <IconComponent className={`w-5 h-5 mr-3 ${
                        paymentMethod === method.value ? 'text-orange-600' : 'text-gray-400'
                      }`} />
                      <span className={`font-medium ${
                        paymentMethod === method.value ? 'text-orange-900' : 'text-gray-700'
                      }`}>
                        {method.label}
                      </span>
                      {paymentMethod === method.value && (
                        <CheckCircle className="w-5 h-5 text-orange-600 ml-auto" />
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Mobile Money Details */}
            {paymentMethod === 'momo' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
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
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
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
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the number registered with your mobile money account
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Special Instructions (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests or dietary notes..."
                rows={3}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none disabled:opacity-50"
              />
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({quantity}x)</span>
                  <span className="font-medium">¢{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated cooking time</span>
                  <span className="font-medium">{meal.cookingTime || meal.deliveryTime} mins</span>
                </div>
                {paymentMethod && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment method</span>
                    <span className="font-medium">
                      {paymentMethods.find(m => m.value === paymentMethod)?.label}
                    </span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">¢{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || !pickupTime || !paymentMethod || ((paymentMethod === 'card' || paymentMethod === 'momo') && !customerEmail)}
              className={`w-full flex items-center justify-center space-x-2 py-4 px-4 rounded-xl font-semibold text-lg transition-all ${
                loading || !pickupTime || !paymentMethod || ((paymentMethod === 'card' || paymentMethod === 'momo') && !customerEmail)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Placing Order...</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  <span>Place Order</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;