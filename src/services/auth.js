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

export const apiGetProfile = async (payload) => {
    return await apiClient.get ( '/users/me')
}

export const apiUpdateProfile = async (updateData) => {
    try {
        const response = await apiClient.patch('/users/me', updateData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
};