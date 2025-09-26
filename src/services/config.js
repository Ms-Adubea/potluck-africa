import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const apiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

// Process the queue of failed requests after token refresh
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

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    // Handle content type for file uploads
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

// Response interceptor with refresh token logic
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh
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

      const refreshToken = localStorage.getItem("refreshToken");
      
      if (!refreshToken) {
        // No refresh token, redirect to login
        clearAuthToken();
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh the token
        const refreshResponse = await axios.post(`${baseUrl}/auth/refresh`, {
          refreshToken: refreshToken
        });

        const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;
        
        // Store new tokens
        localStorage.setItem("token", accessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // Update default headers
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        
        // Process queued requests
        processQueue(null, accessToken);
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);

      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect
        processQueue(refreshError, null);
        clearAuthToken();
        
        // Only redirect if not already on auth pages
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to set tokens after login
export const setAuthToken = (accessToken, refreshToken) => {
  if (accessToken) {
    localStorage.setItem("token", accessToken);
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  }
  
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
};

// Helper function to clear tokens
export const clearAuthToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  delete apiClient.defaults.headers.common["Authorization"];
};