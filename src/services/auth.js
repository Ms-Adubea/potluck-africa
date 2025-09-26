import { apiClient, setAuthToken, clearAuthToken } from "./config";
import { 
  storeProfilePictureUrl, 
  storeCompressedProfilePicture, 
  validateImageFile,
  clearProfilePicture 
} from '../utils/profilePictureUtils';

export const apiRegister = async (userData) => {
  try {
    const response = await apiClient.post('/users/register', userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Updated login function for refresh token support
export const apiLogin = async (credentials) => {
  try {
    const response = await apiClient.post('/users/signIn', credentials);
    const data = response.data;
    
    // Store both access and refresh tokens
    const accessToken = data.accessToken || data.token;
    const refreshToken = data.refreshToken;
    
    if (!accessToken) {
      throw new Error('No access token received from server');
    }
    
    // Set tokens using the helper function
    setAuthToken(accessToken, refreshToken);
    
    // Store user data from login response
    const userData = {
      name: data.name,
      role: data.role,
      // Include any other user data from login response
      ...data.user // If user data is nested
    };
    
    await storeBasicUserData(userData);
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const apiGetProfile = async () => {
  try {
    const response = await apiClient.get('/users/me');
    
    // Store the received profile data
    await storeUserData(response.data);
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    
    // If API fails, try to return data from localStorage
    const fallbackData = getUserDataFromStorage();
    if (fallbackData.firstName && fallbackData.email) {
      return fallbackData;
    }
    
    throw error;
  }
};

export const apiUpdateProfile = async (updateData) => {
  try {
    const mappedData = {};
    
    // Map frontend field names to backend field names
    if (updateData.name) {
      const nameParts = updateData.name.split(' ');
      mappedData.firstName = nameParts[0] || '';
      mappedData.lastName = nameParts.slice(1).join(' ') || '';
    }
    
    if (updateData.firstName) mappedData.firstName = updateData.firstName;
    if (updateData.lastName) mappedData.lastName = updateData.lastName;
    if (updateData.phone) mappedData.phone = updateData.phone;
    if (updateData.password) mappedData.password = updateData.password;

    const response = await apiClient.patch('/users/me', mappedData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Update local storage with new data
    await storeUserData(response.data.user);
    return response.data.user;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

export const apiUpdateProfilePicture = async (file) => {
  try {
    validateImageFile(file);
    
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await apiClient.patch('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.user && response.data.user.avatar) {
      storeProfilePictureUrl(response.data.user.avatar);
    }
    
    return response.data.user;
  } catch (error) {
    console.error('Update profile picture error:', error);
    throw error;
  }
};

export const apiChangePassword = async (currentPassword, newPassword) => {
  try {
    const response = await apiClient.patch('/users/me', {
      password: newPassword
    });
    return response.data;
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
};

// New logout function that calls backend to invalidate refresh token
export const apiLogout = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      // Call backend to invalidate refresh token
      await apiClient.post('/auth/logout', { refreshToken });
    }
  } catch (error) {
    console.error('Logout API call failed:', error);
    // Continue with local cleanup even if API call fails
  } finally {
    // Clear local storage and tokens
    clearUserData();
    clearAuthToken();
  }
};

// Helper function to store basic user data from login
const storeBasicUserData = async (userData) => {
  try {
    if (userData.role) localStorage.setItem('userRole', userData.role);
    if (userData.name) localStorage.setItem('userName', userData.name);
    return true;
  } catch (error) {
    console.error('Error storing basic user data:', error);
    return false;
  }
};

// Helper function to store complete user data from profile
export const storeUserData = async (userData, avatarFile = null) => {
  try {
    // Store user data matching your backend model
    if (userData.role) localStorage.setItem('userRole', userData.role);
    if (userData.firstName) localStorage.setItem('userFirstName', userData.firstName);
    if (userData.lastName) localStorage.setItem('userLastName', userData.lastName);
    if (userData.email) localStorage.setItem('userEmail', userData.email);
    if (userData.phone) localStorage.setItem('userPhone', userData.phone);
    if (userData.createdAt) localStorage.setItem('userJoinDate', userData.createdAt);
    
    // Combine first and last name for display
    const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
    if (fullName) localStorage.setItem('userName', fullName);
    
    // Store profile picture if available
    if (avatarFile) {
      await storeCompressedProfilePicture(avatarFile);
    } else if (userData.avatar) {
      storeProfilePictureUrl(userData.avatar);
    }
    
    return true;
  } catch (error) {
    console.error('Error storing user data:', error);
    return false;
  }
};

// Get user data from localStorage (fallback)
const getUserDataFromStorage = () => {
  const firstName = localStorage.getItem('userFirstName') || '';
  const lastName = localStorage.getItem('userLastName') || '';
  const fullName = localStorage.getItem('userName') || `${firstName} ${lastName}`.trim();
  
  return {
    firstName,
    lastName,
    name: fullName,
    email: localStorage.getItem('userEmail') || '',
    phone: localStorage.getItem('userPhone') || '',
    role: localStorage.getItem('userRole'),
    createdAt: localStorage.getItem('userJoinDate') || new Date().toISOString(),
    avatar: localStorage.getItem('userProfilePicture') || localStorage.getItem('userProfilePicUrl'),
  };
};

// Helper function to clear user data on logout
export const clearUserData = () => {
  // Clear user data
  localStorage.removeItem('userName');
  localStorage.removeItem('userFirstName');
  localStorage.removeItem('userLastName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userPhone');
  localStorage.removeItem('userJoinDate');
  localStorage.removeItem('userRole');
  
  // Clear profile picture
  clearProfilePicture();
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const userData = getUserDataFromStorage();
  return !!(token && (userData.email || userData.name));
};

// Get current user data
export const getCurrentUser = () => {
  if (isAuthenticated()) {
    return getUserDataFromStorage();
  }
  return null;
};