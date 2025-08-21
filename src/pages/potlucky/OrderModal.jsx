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
  Banknote
} from 'lucide-react';
import { apiCreateOrder } from '../../services/potlucky';

const OrderModal = ({ meal, isOpen, onClose, onOrderSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [pickupTime, setPickupTime] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);

  // Payment method options
  const paymentMethods = [
    { value: 'card', label: 'Credit/Debit Card', icon: CreditCard },
    { value: 'mobile_money', label: 'Mobile Money', icon: Smartphone },
    { value: 'cash', label: 'Cash on Pickup', icon: Banknote },
  ];

// Generate time slots for pickup - within next 60 minutes
  useEffect(() => {
    if (isOpen) {
      const generateTimeSlots = () => {
        const slots = [];
        const now = new Date();
        const startTime = new Date(now.getTime() + 30 * 60000); // Start from 30 minutes from now
        
        // Round up to the next 15-minute interval
        const minutesToAdd = (15 - (startTime.getMinutes() % 15)) % 15;
        startTime.setMinutes(startTime.getMinutes() + minutesToAdd);
        startTime.setSeconds(0, 0);
        
        // Generate slots for the next 3 hours (12 slots of 15 minutes each)
        for (let i = 0; i < 12; i++) {
          const time = new Date(startTime.getTime() + (i * 15 * 60000));
          // Don't generate slots beyond 60 minutes from now
          if (time.getTime() - now.getTime() > 60 * 60000) break;
          
          slots.push({
            value: time.toISOString(),
            label: time.toLocaleString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })
          });
        }
        return slots;
      };

      setTimeSlots(generateTimeSlots());
      // Auto-select the first available time slot
      const slots = generateTimeSlots();
      if (slots.length > 0 && !pickupTime) {
        setPickupTime(slots[0].value);
      }
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!pickupTime) {
      setError('Please select a pickup time');
      return;
    }

    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        meal: meal.id,
        quantity,
        pickupTime,
        paymentMethod,
        notes: notes.trim()
      };

      const response = await apiCreateOrder(orderData);
      
      onOrderSuccess && onOrderSuccess(response.order);
      onClose();
      
      // Reset form
      setQuantity(1);
      setPickupTime('');
      setPaymentMethod('');
      setNotes('');
      
    } catch (error) {
      console.error('Order failed:', error);
      setError(error.response?.data?.message || 'Failed to place order. Please try again.');
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
                    className="flex items-center justify-center w-10 h-10 rounded-md bg-white shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="font-semibold text-lg min-w-[3rem] text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex items-center justify-center w-10 h-10 rounded-md bg-white shadow-sm hover:bg-gray-50 transition-colors"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select pickup time</option>
                {timeSlots.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Pickup times start 60 minutes from now
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
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={paymentMethod === method.value}
                        onChange={(e) => setPaymentMethod(e.target.value)}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
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
              disabled={loading || !pickupTime || !paymentMethod}
              className={`w-full flex items-center justify-center space-x-2 py-4 px-4 rounded-xl font-semibold text-lg transition-all ${
                loading || !pickupTime || !paymentMethod
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