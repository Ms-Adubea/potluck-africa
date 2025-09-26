
// import { apiClient } from "./config";

// // === MEALS ===
// export const apiGetAllMeals = async () => {
//   try {
//     const response = await apiClient.get('/meals');
    
//     if (response.data?.meals && Array.isArray(response.data.meals)) {
//       return response.data.meals;
//     } else if (Array.isArray(response.data)) {
//       return response.data;
//     }
//     return [];
//   } catch (error) {
//     console.error('Error fetching all meals:', error);
//     throw error;
//   }
// };

// export const apiGetMealById = async (mealId) => {
//   try {
//     const response = await apiClient.get(`/meals/${mealId}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching meal with ID ${mealId}:`, error);
//     throw error;
//   }
// };

// === FAVORITES ===
export const apiAddFavorite = async (mealId) => {
  try {
    // Changed to PATCH method and fixed URL template
    const response = await apiClient.patch(`/meals/${mealId}/favorite`);
    return response.data;
  } catch (error) {
    console.error("Add favorite failed:", error);
    throw error;
  }
};

export const apiRemoveFavorite = async (mealId) => {
  try {
    const response = await apiClient.patch(`/meals/${mealId}/favorite`);
    return response.data;
  } catch (error) {
    console.error("Remove favorite failed:", error);
    throw error;
  }
};

export const apiGetFavoriteMeals = async () => {
  try {
    const response = await apiClient.get('/meals/{mealId}/favorites'); // Fixed endpoint
    
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data?.favorites) {
      return response.data.favorites;
    }
    return [];
  } catch (error) {
    console.error('Error fetching favorite meals:', error);
    throw error;
  }
};

// export const apiCheckFavoriteStatus = async (mealIds) => {
//   try {
//     const response = await apiClient.post('/favorites/check', { mealIds });
//     return response.data; // Should return object like { mealId: boolean }
//   } catch (error) {
//     console.error('Error checking favorite status:', error);
//     throw error;
//   }
// };

// // === ORDERS ===
// export const apiCreateOrder = async (orderData) => {
//   try {
//     const response = await apiClient.post('/orders', orderData);
//     return response.data;
//   } catch (error) {
//     console.error("Create order failed:", error);
//     throw error;
//   }
// };

// export const apiGetUserOrders = async () => {
//   try {
//     const response = await apiClient.get('/orders/my');
//     return response.data;
//   } catch (error) {
//     console.error("Get user orders failed:", error);
//     throw error;
//   }
// };

// export const apiCancelOrder = async (orderId, reason) => {
//   try {
//     const response = await apiClient.patch(`/orders/${orderId}/cancel`, { reason });
//     return response.data;
//   } catch (error) {
//     console.error('Cancel order failed:', error);
//     throw error;
//   }
// };

// === CART (if you want to implement cart functionality) ===
export const apiAddToCart = async (cartItem) => {
  try {
    const response = await apiClient.post('/cart', cartItem);
    return response.data;
  } catch (error) {
    console.error("Add to cart failed:", error);
    throw error;
  }
};

export const apiGetCart = async () => {
  try {
    const response = await apiClient.get('/cart');
    return response.data;
  } catch (error) {
    console.error("Get cart failed:", error);
    throw error;
  }
};

export const apiRemoveFromCart = async (itemId) => {
  try {
    const response = await apiClient.delete(`/cart/${itemId}`);
    return response.data;
  } catch (error) {
    console.error("Remove from cart failed:", error);
    throw error;
  }
};

export const apiClearCart = async () => {
  try {
    const response = await apiClient.delete('/cart');
    return response.data;
  } catch (error) {
    console.error("Clear cart failed:", error);
    throw error;
  }
};

// // === REVIEWS ===
// export const apiAddReview = async (mealId, reviewData) => {
//   try {
//     const response = await apiClient.post(`/meals/${mealId}/reviews`, reviewData);
//     return response.data;
//   } catch (error) {
//     console.error("Add review failed:", error);
//     throw error;
//   }
// };

export const apiGetMealReviews = async (mealId) => {
  try {
    const response = await apiClient.get(`/meals/${mealId}/reviews`);
    
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data?.reviews) {
      return response.data.reviews;
    }
    return [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const apiEditReview = async (mealId, reviewId, reviewData) => {
  try {
    const response = await apiClient.patch(`/meals/${mealId}/reviews/${reviewId}`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};


import { apiClient } from "./config";

// === MEALS ===
// Update your apiGetAllMeals function in potlucky.js
export const apiGetAllMeals = async () => {
  try {
    const response = await apiClient.get('/meals');
    
    console.log('Raw API response:', response.data);
    
    // Handle the nested structure from your API
    if (response.data?.meals && Array.isArray(response.data.meals)) {
      return response.data.meals;
    } else if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // If no meals found, return empty array
    console.warn('No meals found in response');
    return [];
  } catch (error) {
    console.error('Error fetching all meals:', error);
    throw error;
  }
};

export const apiGetMealById = async (mealId) => {
  try {
    const response = await apiClient.get(`/meals/${mealId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching meal with ID ${mealId}:`, error);
    throw error;
  }
};

// === FAVORITES ===
// export const apiAddFavorite = async (mealId) => {
//   try {
//     const response = await apiClient.patch(`/meals/${mealId}/favorite`);
//     return response.data;
//   } catch (error) {
//     console.error("Add favorite failed:", error);
//     throw error;
//   }
// };

// export const apiRemoveFavorite = async (mealId) => {
//   try {
//     const response = await apiClient.patch(`/meals/${mealId}/favorite`);
//     return response.data;
//   } catch (error) {
//     console.error("Remove favorite failed:", error);
//     throw error;
//   }
// };

// export const apiGetFavoriteMeals = async () => {
//   try {
//     const response = await apiClient.get('/meals/favorites');
    
//     if (Array.isArray(response.data)) {
//       return response.data;
//     } else if (response.data?.favorites) {
//       return response.data.favorites;
//     }
//     return [];
//   } catch (error) {
//     console.error('Error fetching favorite meals:', error);
//     throw error;
//   }
// };

// export const apiCheckFavoriteStatus = async (mealIds) => {
//   try {
//     const response = await apiClient.post('/favorites/check', { mealIds });
//     return response.data;
//   } catch (error) {
//     console.error('Error checking favorite status:', error);
//     throw error;
//   }
// };

// === ORDERS ===
export const apiCreateOrder = async (orderData) => {
  try {
    const response = await apiClient.post('/orders', orderData);
    return response.data; // This should include both order and payment data
  } catch (error) {
    console.error("Create order failed:", error);
    throw error;
  }
};

export const apiGetUserOrders = async () => {
  try {
    const response = await apiClient.get('/orders/my');
    return response.data;
  } catch (error) {
    console.error("Get user orders failed:", error);
    throw error;
  }
};

export const apiCancelOrder = async (orderId, reason) => {
  try {
    const response = await apiClient.patch(`/orders/${orderId}/cancel`, { reason });
    return response.data;
  } catch (error) {
    console.error('Cancel order failed:', error);
    throw error;
  }
};

// === REVIEWS ===
export const apiAddReview = async (mealId, reviewData) => {
  try {
    const response = await apiClient.post(`/meals/${mealId}/review`, reviewData);
    return response.data;
  } catch (error) {
    console.error("Add review failed:", error);
    throw error;
  }
};

// export const apiGetMealReviews = async (mealId) => {
//   try {
//     const response = await apiClient.get(`/meals/${mealId}/review`);
    
//     if (Array.isArray(response.data)) {
//       return response.data;
//     } else if (response.data?.reviews) {
//       return response.data.reviews;
//     }
//     return [];
//   } catch (error) {
//     console.error('Error fetching reviews:', error);
//     throw error;
//   }
// };

// export const apiEditReview = async (mealId, reviewId, reviewData) => {
//   try {
//     const response = await apiClient.patch(`/meals/${mealId}/review/${reviewId}`, reviewData);
//     return response.data;
//   } catch (error) {
//     console.error('Error updating review:', error);
//     throw error;
//   }
// };