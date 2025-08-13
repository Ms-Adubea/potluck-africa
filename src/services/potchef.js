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


// export const apiUpdateMeal = async (id, formData) => {
//   try {
//     const response = await apiClient.patch(`/meals/${id}`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error updating listing:', error);
//     throw error;
//   }
// };

// export const apiGetChefsMeals = async () => {
//   try {
//     const response = await apiClient.get('/meals/mine');
//     // Handle the response structure with count and assets array
//     return {
//       count: response.data?.count || 0,
//       assets: Array.isArray(response.data?.assets) ? response.data.assets : []
//     };
//   } catch (error) {
//     console.error('Error fetching chef meals:', error);
//     throw error;
//   }
// };

// export const apiGetChefsMealById = async (id) => {
//   try {
//     const response = await apiClient.get(`/meals/mine/${id}`);
//     // Handle the response structure with count and assets array
//     return {
//       count: response.data?.count || 0,
//       assets: Array.isArray(response.data?.assets) ? response.data.assets : []
//     };
//   } catch (error) {
//     console.error('Error fetching chef meals:', error);
//     throw error;
//   }
// };

// export const apiGetChefOrders = async () => {
//   try {
//     console.log("Fetching chef's orders from /chef/orders");
//     const response = await apiClient.get('/chef/orders');
//     console.log("Get chef orders response:", response);
//     console.log("Response data:", response.data);
//     return response.data; // Make sure to return response.data consistently
//   } catch (error) {
//     console.error("Get chef orders failed:", error);
//     console.error("Error details:", {
//       message: error.message,
//       status: error.response?.status,
//       statusText: error.response?.statusText,
//       data: error.response?.data,
//       headers: error.response?.headers
//     });
//     throw error;
//   }
// };


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

export const apiUpdateMeal = async (id, formData) => {
  try {
    const response = await apiClient.patch(`/meals/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
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
  const newStatus = currentStatus === "available" ? "unavailable" : "available";

  try {
    const response = await apiClient.patch(`/meals/${id}/status`, {
      status: newStatus
    });
    return response.data.meal; // Return updated meal object
  } catch (error) {
    console.error('Error toggling meal availability:', error);
    throw error;
  }
};

