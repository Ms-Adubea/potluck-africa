// contexts/FavoritesContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiAddFavorite, apiGetFavoriteMeals, apiRemoveFavorite } from '../services/potlucky';

const FavoritesContext = createContext();

const favoritesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FAVORITES':
      return {
        ...state,
        favorites: new Set(action.payload),
        loading: false,
        error: null
      };
    case 'ADD_FAVORITE':
      return {
        ...state,
        favorites: new Set([...state.favorites, action.payload]),
        error: null
      };
    case 'REMOVE_FAVORITE':
      const newFavorites = new Set(state.favorites);
      newFavorites.delete(action.payload);
      return {
        ...state,
        favorites: newFavorites,
        error: null
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
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const FavoritesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, {
    favorites: new Set(),
    loading: true,
    error: null
  });

  // Load favorites on app start
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const favoriteMeals = await apiGetFavoriteMeals();
      const favoriteIds = favoriteMeals.map(meal => meal.id || meal.mealId);
      dispatch({ type: 'SET_FAVORITES', payload: favoriteIds });
    } catch (error) {
      console.error('Failed to load favorites:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load favorites' });
    }
  };

  const addToFavorites = async (mealId) => {
    try {
      // Optimistic update
      dispatch({ type: 'ADD_FAVORITE', payload: mealId });
      
      const result = await apiAddFavorite(mealId);
      
      // Show success feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }
      
      return { success: true, data: result };
    } catch (error) {
      console.error('Failed to add to favorites:', error);
      
      // Rollback optimistic update
      dispatch({ type: 'REMOVE_FAVORITE', payload: mealId });
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add to favorites' });
      
      return { success: false, error: error.message };
    }
  };

  const removeFromFavorites = async (mealId) => {
    try {
      // Optimistic update
      dispatch({ type: 'REMOVE_FAVORITE', payload: mealId });
      
      const result = await apiRemoveFavorite(mealId);
      
      return { success: true, data: result };
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
      
      // Rollback optimistic update
      dispatch({ type: 'ADD_FAVORITE', payload: mealId });
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove from favorites' });
      
      return { success: false, error: error.message };
    }
  };

  const toggleFavorite = async (mealId) => {
    const wasFavorite = state.favorites.has(mealId);
    
    if (wasFavorite) {
      return await removeFromFavorites(mealId);
    } else {
      return await addToFavorites(mealId);
    }
  };

  const isFavorite = (mealId) => state.favorites.has(mealId);

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <FavoritesContext.Provider value={{
      favorites: state.favorites,
      loading: state.loading,
      error: state.error,
      addToFavorites,
      removeFromFavorites,
      toggleFavorite,
      isFavorite,
      loadFavorites,
      clearError
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};