import React, { useState } from 'react';
import { CheckCircle, Clock, CreditCard, AlertCircle, ArrowRight, Phone } from 'lucide-react';
import Swal from 'sweetalert2';
import { apiVerifyPayment } from '../../services/payment';

const OrderSuccessModal = ({ isOpen, onClose, order, payment }) => {
  const [processing, setProcessing] = useState(false);

  const handleCardPayment = () => {
    // Use the authorization URL from your backend response
    const authUrl = payment?.authorizationUrl || order.payment?.authorizationUrl;
    
    if (authUrl) {
      Swal.fire({
        title: 'Complete Card Payment',
        text: 'You will be redirected to Paystack to complete your card payment.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#ea580c',
        confirmButtonText: 'Pay Now',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          // Open payment URL in new tab
          window.open(authUrl, '_blank', 'width=600,height=600');
          
          // Show status message
          Swal.fire({
            title: 'Payment Window Opened',
            html: `
              <div class="text-left">
                <p class="mb-3">Complete your payment in the new window.</p>
                <p class="mb-2"><strong>Amount:</strong> ¢${order.totalPrice?.toFixed(2)}</p>
                <p class="mb-2"><strong>Reference:</strong> ${payment?.paymentReference || order.payment?.reference}</p>
                <div class="bg-blue-50 p-3 rounded-lg mt-3">
                  <p class="text-sm text-blue-800">
                    After completing payment, your order status will be updated automatically.
                  </p>
                </div>
              </div>
            `,
            icon: 'info',
            confirmButtonColor: '#10b981',
            confirmButtonText: 'I understand'
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Payment URL Error',
        text: 'Payment authorization URL not found. Please try placing the order again.',
        confirmButtonColor: '#ea580c'
      });
    }
  };

  const handleMomoStatus = () => {
    Swal.fire({
      title: 'Mobile Money Payment',
      html: `
        <div class="text-left">
          <p class="mb-3">Your mobile money payment has been initiated.</p>
          <p class="mb-2"><strong>Reference:</strong> ${payment?.paymentReference || order.payment?.reference}</p>
          <p class="mb-3">Please check your phone for a payment prompt.</p>
          <div class="bg-blue-50 p-3 rounded-lg">
            <p class="text-sm text-blue-800">
              <strong>Next Steps:</strong><br>
              1. Check your phone for payment notification<br>
              2. Enter your mobile money PIN when prompted<br>
              3. Payment will be processed automatically
            </p>
          </div>
        </div>
      `,
      icon: 'info',
      confirmButtonColor: '#ea580c',
      confirmButtonText: 'Understood'
    });
  };

  const handlePayLater = () => {
    Swal.fire({
      title: 'Pay Later',
      text: 'You can complete your payment from the orders page. Your order will be held for 30 minutes.',
      icon: 'info',
      confirmButtonColor: '#ea580c',
      confirmButtonText: 'Understood'
    }).then(() => {
      onClose();
    });
  };

  if (!isOpen || !order) return null;

  // Determine payment status
  const paymentStatus = order.payment?.status || payment?.status || 'pending';
  const paymentMethod = order.payment?.method || payment?.method || order.paymentMethod;
  const isPaymentPending = paymentStatus === 'pending' || paymentStatus === '' || !paymentStatus;
  const isPaymentRequired = paymentMethod !== 'cash' && isPaymentPending;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        {isPaymentRequired ? (
          // Payment Required
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-orange-600" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">Complete Your Payment</h3>
            <p className="text-gray-600 mb-6">Your order has been placed successfully. Complete payment to confirm.</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Order Total:</span>
                <span className="font-bold text-lg">¢{order.totalPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Payment Method:</span>
                <span className="capitalize font-medium">{paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono text-sm">#{order._id?.slice(-8)}</span>
              </div>
            </div>

            {/* Payment buttons based on method */}
            {paymentMethod === 'card' && (
              <button
                onClick={handleCardPayment}
                disabled={processing}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2 mb-3"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Pay with Card</span>
                    <CreditCard className="w-5 h-5" />
                  </>
                )}
              </button>
            )}

            {paymentMethod === 'momo' && (
              <button
                onClick={handleMomoStatus}
                disabled={processing}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 mb-3"
              >
                <span>Check Mobile Money Status</span>
                <Phone className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={handlePayLater}
              disabled={processing}
              className="w-full text-gray-600 py-2 hover:text-gray-800 transition-colors"
            >
              I'll pay later
            </button>
          </div>
        ) : (
          // Order Successful (Cash or Paid)
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h3>
            <p className="text-gray-600 mb-6">
              {paymentMethod === 'cash' 
                ? 'Your cash order has been confirmed. Pay when you pickup.'
                : 'Your order has been confirmed and payment processed.'
              }
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono text-sm">#{order._id?.slice(-8)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Meal:</span>
                <span className="font-medium">{order.meal?.mealName || order.meal?.name}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-medium">{order.quantity}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Total:</span>
                <span className="font-bold">¢{order.totalPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Pickup Time:</span>
                <span className="font-medium">{order.pickupTime ? new Date(order.pickupTime).toLocaleString() : 'TBD'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  {order.status || 'Pending'}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-orange-700 transition-colors"
            >
              Great, Thanks!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSuccessModal;