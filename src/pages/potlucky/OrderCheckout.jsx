import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  CreditCard, 
  Smartphone, 
  User, 
  Mail, 
  Phone,
  CheckCircle,
  AlertCircle,
  Minus,
  Plus,
  Trash2
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { apiCreateOrder } from '../../services/potlucky';
import { useNavigate } from 'react-router-dom';

const OrderCheckout = () => {
  const navigate = useNavigate();
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // Form state
  const [orderData, setOrderData] = useState({
    deliveryAddress: '',
    contactPhone: '',
    contactEmail: '',
    paymentMethod: 'mobile_money',
    specialInstructions: '',
    deliveryTime: 'asap' // 'asap' or specific time
  });
  
  // Validation state
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    // Redirect if cart is empty
    if (items.length === 0 && !orderSuccess) {
      navigate('/dashboard/potlucky/browse');
    }
  }, [items, orderSuccess, navigate]);

  const validateForm = () => {
    const errors = {};
    
    if (!orderData.deliveryAddress.trim()) {
      errors.deliveryAddress = 'Delivery address is required';
    }
    
    if (!orderData.contactPhone.trim()) {
      errors.contactPhone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(orderData.contactPhone)) {
      errors.contactPhone = 'Please enter a valid phone number';
    }
    
    if (!orderData.contactEmail.trim()) {
      errors.contactEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(orderData.contactEmail)) {
      errors.contactEmail = 'Please enter a valid email address';
    }
    
    if (!orderData.paymentMethod) {
      errors.paymentMethod = 'Please select a payment method';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setOrderData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field if it exists
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const calculateDeliveryFee = () => {
    // Simple delivery fee calculation - you can make this more sophisticated
    const baseDeliveryFee = 5.00;
    const freeDeliveryThreshold = 50.00;
    
    return total >= freeDeliveryThreshold ? 0 : baseDeliveryFee;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const deliveryFee = calculateDeliveryFee();
      const finalTotal = total + deliveryFee;
      
      const orderPayload = {
        items: items.map(item => ({
          mealId: item.mealId,
          quantity: item.quantity,
          unitPrice: item.price
        })),
        deliveryAddress: orderData.deliveryAddress,
        contactPhone: orderData.contactPhone,
        contactEmail: orderData.contactEmail,
        paymentMethod: orderData.paymentMethod,
        specialInstructions: orderData.specialInstructions,
        deliveryTime: orderData.deliveryTime,
        subtotal: total,
        deliveryFee: deliveryFee,
        totalAmount: finalTotal
      };
      
      const response = await apiCreateOrder(orderPayload);
      
      // Clear cart after successful order
      await clearCart();
      
      setOrderSuccess(true);
      
      // Show success notification if supported
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Order Placed Successfully!', {
          body: `Your order #${response.orderNumber} has been placed.`,
          icon: '/icon-192x192.png'
        });
      }
      
      // Vibrate for haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
      
      // Redirect to order tracking after a delay
      setTimeout(() => {
        navigate('/dashboard/potlucky/orders');
      }, 3000);
      
    } catch (err) {
      console.error('Order submission failed:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deliveryFee = calculateDeliveryFee();
  const finalTotal = total + deliveryFee;

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your order. You will receive a confirmation email shortly.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/dashboard/potlucky/orders')}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors"
            >
              View Order Status
            </button>
            <button
              onClick={() => navigate('/dashboard/potlucky/browse')}
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Order Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
        
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <img
                src={item.image || '/api/placeholder/60/60'}
                alt={item.mealName}
                className="w-15 h-15 rounded-lg object-cover"
              />
              
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{item.mealName}</h3>
                <p className="text-sm text-gray-600">by {item.chef}</p>
                <p className="text-sm text-green-600 font-medium">¢{item.price}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-medium w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1 hover:bg-red-100 text-red-600 rounded ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Price Breakdown */}
        <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>¢{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Delivery Fee</span>
            <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
              {deliveryFee === 0 ? 'FREE' : `¢${deliveryFee.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total</span>
            <span>¢{finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Delivery Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Delivery Information</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Address *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <textarea
              value={orderData.deliveryAddress}
              onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
              placeholder="Enter your full delivery address..."
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                formErrors.deliveryAddress ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={3}
            />
          </div>
          {formErrors.deliveryAddress && (
            <p className="text-red-600 text-sm mt-1">{formErrors.deliveryAddress}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={orderData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                placeholder="+233 XX XXX XXXX"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  formErrors.contactPhone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {formErrors.contactPhone && (
              <p className="text-red-600 text-sm mt-1">{formErrors.contactPhone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={orderData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                placeholder="your@email.com"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  formErrors.contactEmail ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {formErrors.contactEmail && (
              <p className="text-red-600 text-sm mt-1">{formErrors.contactEmail}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Instructions
          </label>
          <textarea
            value={orderData.specialInstructions}
            onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
            placeholder="Any special requests or delivery instructions..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            rows={2}
          />
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
        
        <div className="space-y-3">
          <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="mobile_money"
              checked={orderData.paymentMethod === 'mobile_money'}
              onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              className="text-orange-600 focus:ring-orange-500"
            />
            <Smartphone className="w-5 h-5 text-gray-400" />
            <div>
              <div className="font-medium">Mobile Money</div>
              <div className="text-sm text-gray-500">MTN, AirtelTigo, Vodafone</div>
            </div>
          </label>

          <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={orderData.paymentMethod === 'card'}
              onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              className="text-orange-600 focus:ring-orange-500"
            />
            <CreditCard className="w-5 h-5 text-gray-400" />
            <div>
              <div className="font-medium">Credit/Debit Card</div>
              <div className="text-sm text-gray-500">Visa, Mastercard</div>
            </div>
          </label>

          <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={orderData.paymentMethod === 'cash'}
              onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              className="text-orange-600 focus:ring-orange-500"
            />
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <div className="font-medium">Pay on Delivery</div>
              <div className="text-sm text-gray-500">Cash payment on arrival</div>
            </div>
          </label>
        </div>

        {formErrors.paymentMethod && (
          <p className="text-red-600 text-sm">{formErrors.paymentMethod}</p>
        )}
      </div>

      {/* Place Order Button */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4">
        <button
          onClick={handleSubmitOrder}
          disabled={loading || items.length === 0}
          className="w-full bg-orange-600 text-white py-4 px-6 rounded-lg font-medium text-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Placing Order...</span>
            </>
          ) : (
            <>
              <span>Place Order</span>
              <span className="font-bold">¢{finalTotal.toFixed(2)}</span>
            </>
          )}
        </button>
        
        <p className="text-center text-sm text-gray-500 mt-2">
          By placing this order, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default OrderCheckout;