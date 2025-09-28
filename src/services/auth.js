// // 📁 src/services/auth.js
// import { apiClient } from "./config";
// import { storeProfilePictureUrl, storeCompressedProfilePicture } from '../utils/profilePictureUtils';

// export const apiRegister = async (userData) => {
//   try {
//     const response = await apiClient.post('/users/register', userData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// // Updated Login function with profile picture support
// export const apiLogin = async (credentials) => {
//   try {
//     const response = await apiClient.post('/users/signIn', credentials);
//     const data = response.data;
    
//     // Store profile picture if available from server response
//     if (data.profilePicture || data.profilePictureUrl || data.avatar) {
//       const profilePicUrl = data.profilePicture || data.profilePictureUrl || data.avatar;
//       storeProfilePictureUrl(profilePicUrl);
//     }
    
//     return data;
//   } catch (error) {
//     throw error;
//   }
// };

// // Google Sign In - redirect to backend OAuth endpoint
// export const initiateGoogleSignIn = () => {
//   const backendUrl = import.meta.env.VITE_BASE_URL;
//   window.location.href = `${backendUrl}/auth/google`;
// };

// // Fetch user profile (useful for getting user data after Google auth)
// export const fetchUserProfile = async () => {
//   try {
//     const response = await apiClient.get('/users/me');
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// // Handle Google OAuth callback - process token from URL
// export const handleGoogleCallback = async (token) => {
//   try {
//     // ✅ Store token immediately
//     setAuthToken(token); // This sets localStorage and Axios headers

//     const tokenPayload = JSON.parse(atob(token.split('.')[1]));
//     console.log('Token payload:', tokenPayload);
    
//     // Now the token will be used in the request
//     const userData = await fetchUserProfile();

//     return userData;
//   } catch (error) {
//     console.error('Error handling Google callback:', error);
//     throw error;
//   }
// };


// // Helper function to store user data after successful login
// export const storeUserData = async (userData, avatarFile = null) => {
//   try {
//     // Store basic user data
//     localStorage.setItem('userRole', userData.role);
//     localStorage.setItem('userName', userData.name || userData.firstName + ' ' + userData.lastName);
//     localStorage.setItem('userEmail', userData.email);
//     localStorage.setItem('userId', userData.id || userData._id);
    
//     // Store additional user info
//     if (userData.firstName) localStorage.setItem('userFirstName', userData.firstName);
//     if (userData.lastName) localStorage.setItem('userLastName', userData.lastName);
//     if (userData.phone) localStorage.setItem('userPhone', userData.phone);
    
//     // Store approval status
//     if (userData.isApproved !== undefined) {
//       localStorage.setItem('userIsApproved', userData.isApproved.toString());
//     }
    
//     // Store profile completion status
//     if (userData.profileCompleted !== undefined) {
//       localStorage.setItem('profileCompleted', userData.profileCompleted.toString());
//     }
    
//     // Store profile picture if available
//     if (avatarFile) {
//       // If we have the actual file (e.g., from registration)
//       await storeCompressedProfilePicture(avatarFile);
//     } else if (userData.profilePicture || userData.profilePictureUrl || userData.avatar) {
//       // If we have a URL from server response
//       const profilePicUrl = userData.profilePicture || userData.profilePictureUrl || userData.avatar;
//       storeProfilePictureUrl(profilePicUrl);
//     }
    
//     return true;
//   } catch (error) {
//     console.error('Error storing user data:', error);
//     return false;
//   }
// };

// // Helper function to clear user data on logout
// export const clearUserData = () => {
//   // Clear auth data
//   localStorage.removeItem('token');
  
//   // Clear user profile data
//   localStorage.removeItem('userRole');
//   localStorage.removeItem('userName');
//   localStorage.removeItem('userEmail');
//   localStorage.removeItem('userId');
//   localStorage.removeItem('userFirstName');
//   localStorage.removeItem('userLastName');
//   localStorage.removeItem('userPhone');
  
//   // Clear status flags
//   localStorage.removeItem('userIsApproved');
//   localStorage.removeItem('profileCompleted');
  
//   // Clear profile pictures
//   localStorage.removeItem('userProfilePicture');
//   localStorage.removeItem('userProfilePicUrl');
// };

// // Check if user is authenticated
// export const isAuthenticated = () => {
//   const token = localStorage.getItem('token');
//   if (!token) return false;
  
//   try {
//     const tokenPayload = JSON.parse(atob(token.split('.')[1]));
//     const currentTime = Date.now() / 1000;
    
//     // Check if token is expired
//     if (tokenPayload.exp < currentTime) {
//       clearUserData();
//       return false;
//     }
    
//     return true;
//   } catch (error) {
//     console.error('Error checking token:', error);
//     clearUserData();
//     return false;
//   }
// };

// // Get current user role
// export const getUserRole = () => {
//   return localStorage.getItem('userRole');
// };

// // Get current user data
// export const getCurrentUser = () => {
//   const token = localStorage.getItem('token');
//   if (!token) return null;
  
//   return {
//     id: localStorage.getItem('userId'),
//     role: localStorage.getItem('userRole'),
//     name: localStorage.getItem('userName'),
//     email: localStorage.getItem('userEmail'),
//     firstName: localStorage.getItem('userFirstName'),
//     lastName: localStorage.getItem('userLastName'),
//     phone: localStorage.getItem('userPhone'),
//     isApproved: localStorage.getItem('userIsApproved') === 'true',
//     profileCompleted: localStorage.getItem('profileCompleted') === 'true',
//     profilePicture: localStorage.getItem('userProfilePicture') || localStorage.getItem('userProfilePicUrl')
//   };
// };


// 📁 src/services/auth.js - Fixed for your backend
import { apiClient, setAuthToken } from "./config";
import { 
  storeProfilePictureUrl, 
  storeCompressedProfilePicture, 
  validateImageFile,
  clearProfilePicture 
} from '../utils/profilePictureUtils';

export const apiRegister = async (userData) => {
  try {
    const isFormData = userData instanceof FormData;
    
    const response = await apiClient.post('/users/register', userData, {
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login function matching your backend response
export const apiLogin = async (credentials) => {
  try {
    const response = await apiClient.post('/users/signIn', credentials);
    const data = response.data;
    
    // Store token (your backend now returns 'accessToken' and 'refreshToken')
    if (data.accessToken) {
      localStorage.setItem('token', data.accessToken);
      // Also store refresh token if you plan to use it
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
    }
    
    // Store user data from NEW backend response format
    const userData = {
      id: data.user.id,
      firstName: data.user.firstName,
      lastName: data.user.lastName,
      name: `${data.user.firstName} ${data.user.lastName}`,
      email: data.user.email,
      phone: data.user.phone,
      role: data.user.role,
      status: data.user.status,
      profileCompleted: data.user.profileCompleted
    };
    
    await storeUserData(userData);
    
    return data; // Return the full response
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
    // Your backend expects specific field names: firstName, lastName, phone, password
    const mappedData = {};
    
    // Map frontend field names to backend field names
    if (updateData.name) {
      // Split name into firstName and lastName if needed
      const nameParts = updateData.name.split(' ');
      mappedData.firstName = nameParts[0] || '';
      mappedData.lastName = nameParts.slice(1).join(' ') || '';
    }
    
    if (updateData.firstName) mappedData.firstName = updateData.firstName;
    if (updateData.lastName) mappedData.lastName = updateData.lastName;
    if (updateData.phone) mappedData.phone = updateData.phone;
    if (updateData.password) mappedData.password = updateData.password;
    
    // Note: Your backend doesn't seem to handle address, bio, or role-specific fields
    // You may need to add those to your backend validator and controller

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
    // Validate the image file
    validateImageFile(file);
    
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await apiClient.patch('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Store the new profile picture URL
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
    // Store user data matching your NEW backend response
    if (userData.id) localStorage.setItem('userId', userData.id);
    if (userData.role) localStorage.setItem('userRole', userData.role);
    if (userData.firstName) localStorage.setItem('userFirstName', userData.firstName);
    if (userData.lastName) localStorage.setItem('userLastName', userData.lastName);
    if (userData.email) localStorage.setItem('userEmail', userData.email);
    if (userData.phone) localStorage.setItem('userPhone', userData.phone);
    if (userData.status) localStorage.setItem('userStatus', userData.status);
    if (userData.profileCompleted !== undefined) {
      localStorage.setItem('profileCompleted', userData.profileCompleted.toString());
    }
    
    // Combine first and last name for display
    const fullName = userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
    if (fullName) localStorage.setItem('userName', fullName);
    
    // Store profile picture if available
    if (avatarFile) {
      await storeCompressedProfilePicture(avatarFile);
    } else if (userData.avatar) {
      storeProfilePictureUrl(userData.avatar);
    }
    
    console.log('✅ User data stored successfully:', {
      role: userData.role,
      name: fullName,
      email: userData.email
    });
    
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

// Clear user data function should also clear temp token
export const clearUserData = () => {
  // Clear authentication data
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tempToken'); // Add this line
  localStorage.removeItem('userRole');
  
  // Clear user data
  localStorage.removeItem('userName');
  localStorage.removeItem('userFirstName');
  localStorage.removeItem('userLastName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userPhone');
  localStorage.removeItem('userJoinDate');
  
  // Clear profile picture
  clearProfilePicture();
};


// Update your isAuthenticated function to handle temp tokens
export const isAuthenticated = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('tempToken');
  const userData = getUserDataFromStorage();
  
  if (!token) {
    return false;
  }
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (payload.exp < currentTime) {
      console.log('Token expired');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking token validity:', error);
    return false;
  }
};


// Get current user data
export const getCurrentUser = () => {
  if (isAuthenticated()) {
    return getUserDataFromStorage();
  }
  return null;
};


// 📁 src/services/auth.js - Add these functions to your existing auth.js file

// Add this refresh token function
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    console.log('Attempting to refresh token...');

    const response = await apiClient.post('/users/refresh-token', {}, {
      headers: {
        'x-refresh-token': refreshToken
      }
    });

    const { accessToken, refreshToken: newRefreshToken, user } = response.data;

    // Update stored tokens
    localStorage.setItem('token', accessToken);
    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken);
    }

    // Update axios headers
    setAuthToken(accessToken);

    // Update user data if provided
    if (user) {
      await storeUserData(user);
    }

    console.log('Token refreshed successfully');
    return {
      accessToken,
      refreshToken: newRefreshToken,
      user
    };
  } catch (error) {
    console.error('Token refresh failed:', error);
    
    // Clear tokens and redirect to login on refresh failure
    clearUserData();
    localStorage.removeItem('refreshToken');
    
    // Only redirect if not already on login page
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    
    throw error;
  }
};

// Add token expiry check function
export const isTokenExpiringSoon = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = payload.exp - currentTime;
    
    // Return true if token expires in less than 5 minutes (300 seconds)
    return timeUntilExpiry < 300;
  } catch (error) {
    console.error('Error checking token expiry:', error);
    return true;
  }
};

export const isTempTokenValid = () => {
  const tempToken = localStorage.getItem('tempToken');
  
  if (!tempToken) {
    return false;
  }
  
  try {
    const payload = JSON.parse(atob(tempToken.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (payload.exp < currentTime) {
      console.log('Temp token expired');
      localStorage.removeItem('tempToken');
      return false;
    }
    
    // Check if it's actually a temp token
    if (payload.temp && payload.scope === 'profile_completion') {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking temp token validity:', error);
    localStorage.removeItem('tempToken');
    return false;
  }
};
