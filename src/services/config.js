import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const apiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json', // Default to JSON
  },
});

// Request interceptor to add token and adjust content type
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    // Set content-type based on data type
    if (config.data instanceof FormData) {
      // For FormData (file uploads), let the browser set the content-type
      delete config.headers['Content-Type'];
    } else {
      // For regular JSON requests
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

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common HTTP errors
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("token");
            // Optionally redirect to login
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

// Helper function to set token after login
export const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem("token", token);
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        localStorage.removeItem("token");
        delete apiClient.defaults.headers.common["Authorization"];
    }
};

// Helper function to clear token
export const clearAuthToken = () => {
    localStorage.removeItem("token");
    delete apiClient.defaults.headers.common["Authorization"];
};