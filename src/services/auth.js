import { apiClient } from "./config"

export const apiRegister = async (userData) => {
  try {
    const response = await apiClient.post('/users/register', userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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