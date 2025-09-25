import React, { useState } from 'react';
import { CheckCircle, Clock, CreditCard, AlertCircle, ArrowRight } from 'lucide-react';
import Swal from 'sweetalert2';
import { apiVerifyPayment } from '../../services/payment';

const OrderSuccessModal = ({ isOpen, onClose, order, payment }) => {
  const [processing, setProcessing] = useState(false);

  // Load Paystack script dynamically
  const loadPaystackScript = () => {
    return new Promise((resolve) => {
      if (window.PaystackPop) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = resolve;
      script.onerror = () => {
        console.error('Failed to load Paystack script');
        Swal.fire({
          icon: 'error',
          title: 'Payment Error',
          text: 'Failed to load payment system. Please refresh and try again.',
          confirmButtonColor: '#ea580c'
        });
      };
      document.head.appendChild(script);
    });
  };

  const handlePaystackPayment = async () => {
    try {
      setProcessing(true);
      await loadPaystackScript();

      if (!window.PaystackPop) {
        throw new Error('Paystack script failed to load');
      }

      // Get user email from order or prompt for it if still missing
      const userEmail = order.buyer?.email || order.customerEmail || 'customer@example.com';

      const handler = window.PaystackPop.setup({
        key: process.env.VITE_PAYSTACK_PUBLIC_KEY, // Add this to your .env file
        email: userEmail,
        amount: Math.round(order.totalPrice * 100), // Amount in pesewas (Ghana) or kobo (Nigeria)
        currency: 'GHS', // Change to 'NGN' for Nigeria
        ref: payment.reference || `order_${order._id}_${Date.now()}`,
        
        metadata: {
          orderId: order._id,
          buyerId: order.buyer?._id,
          mealName: order.meal?.mealName || order.meal?.name,
          quantity: order.quantity,
          custom_fields: [
            {
              display_name: "Order ID",
              variable_name: "order_id",
              value: order._id
            }
          ]
        },

        callback: async function(response) {
          console.log('Payment successful:', response);
          await handlePaymentSuccess(response);
        },

        onClose: function() {
          console.log('Payment modal closed');
          setProcessing(false);
        }
      });

      handler.openIframe();

    } catch (error) {
      console.error('Error initializing payment:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Payment Error',
        text: 'Failed to initialize payment. Please try again.',
        confirmButtonColor: '#ea580c'
      });
      setProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paystackResponse) => {
    try {
      setProcessing(true);
      
      // Show loading state
      Swal.fire({
        title: 'Verifying Payment',
        text: 'Please wait while we verify your payment...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      // Verify payment with your backend
      const verificationResult = await apiVerifyPayment(paystackResponse.reference);
      
      if (verificationResult.success) {
        // Show success message
        await Swal.fire({
          icon: 'success',
          title: 'Payment Successful!',
          text: 'Your payment has been processed successfully. You will receive a confirmation email shortly.',
          confirmButtonColor: '#10b981',
          confirmButtonText: 'Great!'
        });
        
        // Close modal and potentially redirect
        onClose();
        
        // Optional: Redirect to orders page after a delay
        setTimeout(() => {
          // window.location.href = '/orders';
        }, 2000);
        
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Payment Verification Failed',
          text: 'Your payment was processed but could not be verified. Please contact support with your reference: ' + paystackResponse.reference,
          confirmButtonColor: '#ea580c'
        });
      }
      
    } catch (error) {
      console.error('Payment verification error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Verification Error',
        text: 'Payment verification failed. Please contact support if your account was charged.',
        confirmButtonColor: '#ea580c'
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleWindowRedirect = () => {
    if (payment?.authorization_url) {
      // Show confirmation before redirecting
      Swal.fire({
        title: 'Redirecting to Payment',
        text: 'You will be redirected to Paystack to complete your payment.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#ea580c',
        confirmButtonText: 'Continue',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = payment.authorization_url;
        }
      });
    }
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        {order?.payment?.status === 'pending' && payment ? (
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
                <span className="capitalize font-medium">{order.payment?.method}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono text-sm">#{order._id?.slice(-8)}</span>
              </div>
            </div>

            {/* Primary payment button - Inline popup */}
            <button
              onClick={handlePaystackPayment}
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
                  <span>Pay Now</span>
                  <CreditCard className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Alternative payment button - Full redirect */}
            {payment?.authorization_url && (
              <button
                onClick={handleWindowRedirect}
                disabled={processing}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 mb-3"
              >
                <span>Pay on Paystack Site</span>
                <ArrowRight className="w-4 h-4" />
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
          // Cash Order or Already Paid
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h3>
            <p className="text-gray-600 mb-6">
              {order?.payment?.method === 'cash' 
                ? 'Your cash order has been confirmed. Pay when you pickup.'
                : 'Your order has been confirmed and payment processed.'
              }
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono text-sm">#{order?._id?.slice(-8)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Pickup Time:</span>
                <span className="font-medium">{order?.pickupTime ? new Date(order.pickupTime).toLocaleString() : 'TBD'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  {order?.status || 'Pending'}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-orange-700 transition-colors"
            >
              View My Orders
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSuccessModal;