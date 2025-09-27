// 📁 src/services/config.js - Replace your entire config.js with this updated version
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const apiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track if we're currently refreshing to avoid multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor to add token and adjust content type
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    // Set content-type based on data type
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Enhanced response interceptor with automatic token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we're already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          console.log('Attempting automatic token refresh...');
          
          const response = await apiClient.post('/users/refresh-token', {}, {
            headers: {
              'x-refresh-token': refreshToken
            }
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          // Update stored tokens
          localStorage.setItem('token', accessToken);
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }

          // Update axios default headers
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

          console.log('Token refreshed automatically');

          // Process the queue of failed requests
          processQueue(null, accessToken);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);

        } catch (refreshError) {
          console.error('Automatic token refresh failed:', refreshError);
          
          // Process queue with error
          processQueue(refreshError, null);
          
          // Clear all auth data
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userName');
          localStorage.removeItem('userEmail');
          
          // Only redirect if not already on login page
          if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
            console.log('Redirecting to login due to refresh failure');
            window.location.href = '/login';
          }
          
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // No refresh token available
        console.log('No refresh token available, clearing auth data');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        
        if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
          window.location.href = '/login';
        }
        
        isRefreshing = false;
        processQueue(error, null);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to set token after login
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log('Auth token set successfully');
  } else {
    localStorage.removeItem("token");
    delete apiClient.defaults.headers.common["Authorization"];
    console.log('Auth token cleared');
  }
};

// Helper function to clear token
export const clearAuthToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  delete apiClient.defaults.headers.common["Authorization"];
  console.log('All auth tokens cleared');
};