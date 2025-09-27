import { apiClient } from "./config";

export const apiAddMeal = async (formData, config = {}) => {
  try {
    const response = await apiClient.post('/meals', formData, config);
    return response.data;
  } catch (error) {
    console.error('Error adding meal:', error);
    throw error;
  }
};


// 📁 src/services/potchef.js
export const apiGetChefOrders = async (page = 1) => {
  try {
    const response = await apiClient.get(`/chef/orders?page=${page}`);
    return response.data; // contains page, totalPages, orders, etc.
  } catch (error) {
    console.error("❌ Failed to fetch chef orders:", error);
    throw error;
  }
};


export const apiUpdateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await apiClient.patch(`/chef/orders/${orderId}/status`, {
      status: newStatus,
    });
    return response.data.order;
  } catch (error) {
    console.error(`Failed to update status for order ${orderId}:`, error);
    throw error;
  }
};


export const apiGetChefsMeals = async () => {
  try {
    const response = await apiClient.get('/meals/mine');
    console.log('API Response:', response.data); // Add this for debugging
    
    // For array response
    if (Array.isArray(response.data)) {
      return {
        count: response.data.length,
        assets: response.data
      };
    }
    
    // For object response - check for "meals" property instead of "assets"
    return {
      count: response.data?.count || 0,
      assets: Array.isArray(response.data?.meals) ? response.data.meals : []
      //                                    ^^^^^ Changed from "assets" to "meals"
    };
  } catch (error) {
    console.error('Error fetching chef meals:', error);
    throw error;
  }
};

export const apiGetChefsMealById = async (id) => {
  try {
    const response = await apiClient.get(`/meals/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching meal by ID:', error);
    throw error;
  }
};

// Updated potchef.js API service

export const apiUpdateMeal = async (id, formData) => {
  try {
    const response = await apiClient.patch(`/meals/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    // Return the meal object directly from the response
    return response.data.meal || response.data;
  } catch (error) {
    console.error('Error updating meal:', error);
    throw error;
  }
};

// Alternative approach if your API expects JSON for arrays:
export const apiUpdateMealWithJSON = async (id, mealData) => {
  try {
    const response = await apiClient.patch(`/meals/${id}`, mealData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data.meal || response.data;
  } catch (error) {
    console.error('Error updating meal:', error);
    throw error;
  }
};

export const apiDeleteMeal = async (id) => {
  try {
    const response = await apiClient.delete(`/meals/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting meal:', error);
    throw error;
  }
};

export const apiToggleMealAvailability = async (id, currentStatus) => {
  // Use capitalized status values to match backend expectations
  const isCurrentlyAvailable = currentStatus === "Available" || currentStatus === "Pending";
  const newStatus = isCurrentlyAvailable ? "Unavailable" : "Available";

  try {
    const response = await apiClient.patch(`/meals/${id}/status`, {
      status: newStatus
    });
    return response.data.meal;
  } catch (error) {
    console.error('Error toggling meal availability:', error);
    throw error;
  }
};


// Complete Profile
export const apiGetBanks = async () => {
    try {
        const response = await apiClient.get('/banks');
        return response.data;
    } catch (error) {
        console.error('Error fetching banks:', error);
        throw error;
    }
};

export const apiConfirmBankAccount = async () => {
    try {
        const response = await apiClient.get('/resolve-account');
        return response.data;
    } catch (error) {
        console.error('Error confirming bank account:', error);
        throw error;
    }
};

export const apiCompleteProfile = async (userData) => {
  try {
    const response = await apiClient.post('/complete-profile', userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Profile completion error:', error);
    throw error;
  }
};