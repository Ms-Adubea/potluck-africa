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
    
    // Prepare payload according to Paystack API
    const payload = {
      orderId: paymentData.orderId,
      method: paymentData.method,
      email: paymentData.email // Required by Paystack for all payments
    };

    // Add mobile money details for momo payments
    if (paymentData.method === 'momo' && paymentData.momo) {
      if (!paymentData.momo.phone || !paymentData.momo.provider) {
        throw new Error('Mobile money phone and provider are required');
      }
      payload.momo = {
        phone: paymentData.momo.phone,
        provider: paymentData.momo.provider,
        currency: getCurrencyForProvider(paymentData.momo.provider)
      };
    }
    
    console.log('Final payment payload:', payload);
    const response = await apiClient.post('/api/payments/create-payment', payload);
    console.log('Payment response from backend:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Create payment failed:', error);
    
    let errorMessage = 'Payment initialization failed';
    if (error.response?.data) {
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

// Vodafone momo payment only
export const apiVodafoneMomo = async (voucherData) => {
  try {
    const response = await apiClient.post('/api/payments/submit-otp', voucherData);
    return response.data;
  } catch (error) {
    console.error('Voucher submission failed:', error);
    throw error;
  }
};

// Check payment status after timeout (for offline providers)
export const checkPaymentStatus = async (reference, maxAttempts = 12) => {
  let attempts = 0;
  
  const checkStatus = async () => {
    attempts++;
    try {
      const result = await apiVerifyPayment(reference);
      console.log(`Payment check attempt ${attempts}:`, result);
      
      if (result.status === 'success' || result.status === 'failed') {
        return result;
      }
      
      if (attempts >= maxAttempts) {
        return { 
          status: 'timeout', 
          message: 'Payment verification timeout after 3 minutes' 
        };
      }
      
      // Wait 15 seconds before next check (12 attempts = 3 minutes)
      await new Promise(resolve => setTimeout(resolve, 15000));
      return checkStatus();
    } catch (error) {
      console.error(`Payment check attempt ${attempts} failed:`, error);
      
      if (attempts >= maxAttempts) {
        return { 
          status: 'error', 
          message: 'Payment verification failed after multiple attempts' 
        };
      }
      
      await new Promise(resolve => setTimeout(resolve, 15000));
      return checkStatus();
    }
  };
  
  return checkStatus();
};

// Helper function to get currency for provider
const getCurrencyForProvider = (provider) => {
  const providerCurrencies = {
    'mtn': 'GHS',
    'vod': 'GHS', 
    'airteltigo': 'GHS',
    'atl': 'GHS' // Airtel Money
  };
  return providerCurrencies[provider] || 'GHS';
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