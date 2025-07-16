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


export const apiUpdateMeal = async (id, formData) => {
  try {
    const response = await apiClient.patch(`/meals/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating listing:', error);
    throw error;
  }
};

export const apiGetChefsMeals = async () => {
  try {
    const response = await apiClient.get('/meals/mine');
    // Handle the response structure with count and assets array
    return {
      count: response.data?.count || 0,
      assets: Array.isArray(response.data?.assets) ? response.data.assets : []
    };
  } catch (error) {
    console.error('Error fetching chef meals:', error);
    throw error;
  }
};

export const apiGetChefOrders = async () => {
  try {
    console.log("Fetching chef's orders from /chef/orders");
    const response = await apiClient.get('/chef/orders');
    console.log("Get chef orders response:", response);
    console.log("Response data:", response.data);
    return response.data; // Make sure to return response.data consistently
  } catch (error) {
    console.error("Get chef orders failed:", error);
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

export const apiApproveorRejectOrder = async (id, data) => {
  const res = await apiClient.patch(`/chef/orders/{orderId}/status`, data);
  return res.data;
};