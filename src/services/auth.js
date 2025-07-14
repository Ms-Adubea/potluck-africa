import { apiClient } from "./config"

// export const apiSignup = async (formData) => {
//     try {
//         console.log('Sending registration data:', formData);
//         if (!formData.get('confirmPassword')) {
//             throw new Error('Confirm password is required');
//         }
        
//         const response = await apiClient.post('/users/register', formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         });
//         console.log('Registration response:', response);
//         return response;
//     } catch (error) {
//         console.error('Registration error in service:', error);
//         throw error;
//     }
// };

export const apiRegister = async (userData) => {
  try {
    const response = await apiClient.post('/users/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Login function
export const apiLogin = async (credentials) => {
  try {
    const response = await apiClient.post('/users/signIn', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};