import { apiClient } from "./config";

export const apiGetAllMeals = async () => {
  try {
    const response = await apiClient.get('/meals');
    
    // Handle the actual API response structure
    if (response.data?.meals && Array.isArray(response.data.meals)) {
      return response.data.meals; // Return the meals array from the response
    } else if (Array.isArray(response.data)) {
      return response.data; // If API returns array directly
    } else if (response.data?.produce) {
      return response.data.produce; // Legacy fallback
    }
    
    return []; // Default fallback
  } catch (error) {
    console.error('Error fetching all meals:', error);
    throw error;
  }
};


// services/potlucky.js
export const apiGetMealById = async (mealId) => {
  try {
    const response = await apiClient.get(`/meals/${mealId}`);
    
    if (response.data) {
      return response.data; // Return the meal object
    }
    
    return null; // Return null if no data
  } catch (error) {
    console.error(`Error fetching meal with ID ${mealId}:`, error);
    throw error;
  }
};

export const apiAddReview = async (userData) => {
  try {
    const response = await apiClient.post(`/meals/{mealId}/review`, userData);
    return response.data;
  } catch (error) {
    console.error("Add review failed:", error);
    throw error;
  }
};

export const apiOrderMeal = async (userData) => {
  try {
    const response = await apiClient.post(`/orders`, userData);
    return response.data;
  } catch (error) {
    console.error("Add order failed:", error);
    throw error;
  }
};

export const apiCancelOrder = async (id, formData) => {
  try {
    console.log("Cancelling orders with ID:", id, "Data:", formData);
    const response = await apiClient.patch(`/orders/{orderId}/cancel`, formData, {
      headers: {
        'Content-Type': 'application/json', // Changed from multipart/form-data since you're sending JSON
      },
    });
    console.log("Update produce response:", response);
    return response.data;
  } catch (error) {
    console.error('Update produce failed:', error);
    console.error("Error details:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    throw error;
  }
};

export const apiGetUserOrders = async () => {
  try {
    console.log("Fetching user's orders from /orders/my");
    const response = await apiClient.get('/orders/my');
    console.log("Get user orders response:", response);
    console.log("Response data:", response.data);
    return response.data; // Make sure to return response.data consistently
  } catch (error) {
    console.error("Get user orders failed:", error);
    console.error("Error details:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
    throw error;
  }
};

export const apiGetFavoriteMeals = async () => {
  try {
    const response = await apiClient.get(`/meals/${id}/favorites`);
    
    // Handle both possible response structures
    if (Array.isArray(response.data)) {
      return response.data; // If API returns array directly
    } else if (response.data?.produce) {
      return response.data.produce; // If API returns { produce: [...] }
    }
    
    return []; // Default fallback
  } catch (error) {
    console.error('Error fetching all meals:', error);
    throw error;
  }
};