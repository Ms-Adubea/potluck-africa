// 📁 src/services/auth.js
import { apiClient } from "./config";
import { storeProfilePictureUrl, storeCompressedProfilePicture } from '../utils/profilePictureUtils';

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

// Updated Login function with profile picture support
export const apiLogin = async (credentials) => {
  try {
    const response = await apiClient.post('/users/signIn', credentials);
    const data = response.data;
    
    // Store profile picture if available from server response
    if (data.profilePicture || data.profilePictureUrl || data.avatar) {
      const profilePicUrl = data.profilePicture || data.profilePictureUrl || data.avatar;
      storeProfilePictureUrl(profilePicUrl);
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

// Helper function to store user data after successful login
export const storeUserData = async (userData, avatarFile = null) => {
  try {
    // Store basic user data
    localStorage.setItem('userRole', userData.role);
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userEmail', userData.email);
    
    // Store profile picture if available
    if (avatarFile) {
      // If we have the actual file (e.g., from registration)
      await storeCompressedProfilePicture(avatarFile);
    } else if (userData.profilePicture || userData.profilePictureUrl || userData.avatar) {
      // If we have a URL from server response
      const profilePicUrl = userData.profilePicture || userData.profilePictureUrl || userData.avatar;
      storeProfilePictureUrl(profilePicUrl);
    }
    
    return true;
  } catch (error) {
    console.error('Error storing user data:', error);
    return false;
  }
};

// Helper function to clear user data on logout
export const clearUserData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userProfilePicture');
  localStorage.removeItem('userProfilePicUrl');
};