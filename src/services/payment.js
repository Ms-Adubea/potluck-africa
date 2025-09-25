// import { apiClient } from './config';

// // === PAYMENT FUNCTIONS ===
// export const apiCreatePayment = async (paymentData) => {
//   try {
//     const response = await apiClient.post('/create-payment', paymentData);
//     return response.data;
//   } catch (error) {
//     console.error('Create payment failed:', error);
//     throw error;
//   }
// };

// export const apiVerifyPayment = async (reference) => {
//   try {
//     // Fixed the endpoint to accept reference as parameter
//     const response = await apiClient.get(`/verify-payment/${reference}`);
//     return response.data;
//   } catch (error) {
//     console.error('Payment verification failed:', error);
//     throw error;
//   }
// };

import { apiClient } from './config';

// === PAYMENT FUNCTIONS ===
export const apiCreatePayment = async (paymentData) => {
  try {
    console.log('Sending payment data to backend:', paymentData);
    
    // Validate required fields before sending
    if (!paymentData.orderId) {
      throw new Error('Order ID is required for payment processing');
    }
    if (!paymentData.amount) {
      throw new Error('Amount is required for payment processing');
    }
    if (!paymentData.paymentMethod) {
      throw new Error('Payment method is required');
    }
    
    // Email is only required for non-cash payments
    if (paymentData.paymentMethod !== 'cash' && !paymentData.email) {
      throw new Error('Email is required for online payment processing');
    }
    
    // Mobile money validation
    if (paymentData.paymentMethod === 'momo') {
      if (!paymentData.momo?.phone) {
        throw new Error('Mobile money phone number is required');
      }
      if (!paymentData.momo?.provider) {
        throw new Error('Mobile money provider is required');
      }
    }
    
    const response = await apiClient.post('/create-payment', paymentData);
    console.log('Payment response from backend:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create payment failed:', error);
    console.error('Error response:', error.response?.data);
    
    // Return a more user-friendly error message
    const errorMessage = error.response?.data?.error || error.message || 'Payment initialization failed';
    throw new Error(errorMessage);
  }
};

export const apiVerifyPayment = async (reference) => {
  try {
    const response = await apiClient.get(`/verify-payment/${reference}`);
    return response.data;
  } catch (error) {
    console.error('Payment verification failed:', error);
    throw error;
  }
};