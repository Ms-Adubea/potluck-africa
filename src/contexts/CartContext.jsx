// contexts/CartContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiAddToCart, apiClearCart, apiRemoveFromCart } from '../services/potlucky';
// import { apiAddToCart, apiGetCart, apiRemoveFromCart, apiClearCart } from '../services/potlucky';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload,
        loading: false,
        total: calculateTotal(action.payload)
      };
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.mealId === action.payload.mealId);
      let newItems;
      
      if (existingItem) {
        newItems = state.items.map(item =>
          item.mealId === action.payload.mealId
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [...state.items, action.payload];
      }
      
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems)
      };
    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: filteredItems,
        total: calculateTotal(filteredItems)
      };
    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.itemId
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems)
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

const calculateTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    loading: false,
    error: null
  });

  // Load cart on app start
  useEffect(() => {
    loadCart();
  }, []);

  // Sync cart with localStorage for PWA offline support
  useEffect(() => {
    if (typeof window !== 'undefined' && state.items.length > 0) {
      localStorage.setItem('potlucky_cart', JSON.stringify(state.items));
    }
  }, [state.items]);

  const loadCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Try to load from API first
      try {
        const cartData = await apiGetCart();
        dispatch({ type: 'SET_CART', payload: cartData.items || [] });
      } catch (apiError) {
        // Fallback to localStorage for offline support
        const localCart = localStorage.getItem('potlucky_cart');
        if (localCart) {
          const items = JSON.parse(localCart);
          dispatch({ type: 'SET_CART', payload: items });
        } else {
          dispatch({ type: 'SET_CART', payload: [] });
        }
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' });
    }
  };

  const addToCart = async (meal, quantity = 1) => {
    try {
      const cartItem = {
        mealId: meal.id,
        mealName: meal.name || meal.mealName,
        price: meal.price,
        quantity,
        chef: meal.chef || `${meal.createdBy?.firstName} ${meal.createdBy?.lastName}`,
        image: meal.image || (meal.photos && meal.photos[0]),
        location: meal.location || meal.pickupLocation
      };

      // Optimistically update UI
      dispatch({ type: 'ADD_ITEM', payload: cartItem });

      // Try to sync with server
      try {
        await apiAddToCart(cartItem);
      } catch (apiError) {
        console.warn('Failed to sync cart with server, using local storage');
      }

      // Haptic feedback for mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to add to cart:', error);
      return { success: false, error: error.message };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      dispatch({ type: 'REMOVE_ITEM', payload: itemId });
      
      try {
        await apiRemoveFromCart(itemId);
      } catch (apiError) {
        console.warn('Failed to sync cart removal with server');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      return { success: false, error: error.message };
    }
  };

  const updateQuantity = (itemId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  };

  const clearCart = async () => {
    try {
      dispatch({ type: 'CLEAR_CART' });
      localStorage.removeItem('potlucky_cart');
      
      try {
        await apiClearCart();
      } catch (apiError) {
        console.warn('Failed to sync cart clear with server');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Failed to clear cart:', error);
      return { success: false, error: error.message };
    }
  };

  const getItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      ...state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      loadCart,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
