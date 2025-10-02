import { apiClient } from './config';

// === PAYMENT FUNCTIONS ===
export const apiCreatePayment = async (paymentData) => {
  try {
    console.log('Sending payment data to backend:', paymentData);
    
    // Validate required fields
    if (!paymentData.orderId) {
      console.error('Missing orderId in payment data:', paymentData);
      throw new Error('Order ID is required for payment processing');
    }
    if (!paymentData.method) {
      console.error('Missing method in payment data:', paymentData);
      throw new Error('Payment method is required');
    }
    
    // Prepare payload according to your API documentation
    const payload = {
      orderId: paymentData.orderId,
      method: paymentData.method
    };

    // Add mobile money details for momo payments
    if (paymentData.method === 'momo' && paymentData.momo) {
      if (!paymentData.momo.phone || !paymentData.momo.provider) {
        throw new Error('Mobile money phone and provider are required');
      }
      payload.momo = {
        phone: paymentData.momo.phone,
        provider: paymentData.momo.provider
      };
    }
    
    console.log('Final payment payload:', payload);
    const response = await apiClient.post('/api/payments/create-payment', payload);
    console.log('Payment response from backend:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Create payment failed:', error);
    console.error('Error response data:', error.response?.data);
    console.error('Error response status:', error.response?.status);
    console.error('Error response headers:', error.response?.headers);
    
    // Extract more detailed error information
    let errorMessage = 'Payment initialization failed';
    
    if (error.response?.data) {
      // Handle different error response formats
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data.details) {
        errorMessage = error.response.data.details;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

export const apiVerifyPayment = async (reference) => {
  try {
    const response = await apiClient.get(`/api/payments/verify-payment/${reference}`);
    return response.data;
  } catch (error) {
    console.error('Payment verification failed:', error);
    throw error;
  }
};

// Helper function to open payment URL
export const openPaymentWindow = (authorizationUrl, options = {}) => {
  const defaultOptions = {
    width: 600,
    height: 600,
    scrollbars: 'yes',
    resizable: 'yes',
    status: 'yes'
  };
  
  const windowOptions = { ...defaultOptions, ...options };
  const windowFeatures = Object.entries(windowOptions)
    .map(([key, value]) => `${key}=${value}`)
    .join(',');
    
  return window.open(authorizationUrl, '_blank', windowFeatures);
};



// Vodafone momo payment only
export const apiVodafoneMomo = async (voucherData) => {
  const response = await apiClient.post('/api/payment/submit-otp', voucherData);
  return response.data;
};