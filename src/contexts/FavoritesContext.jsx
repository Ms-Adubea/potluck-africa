// contexts/FavoritesContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiAddFavorite, apiGetFavoriteMeals, apiRemoveFavorite } from '../services/potlucky';
// import { apiGetFavoriteMeals, apiAddFavorite, apiRemoveFavorite } from '../services/potlucky';

const FavoritesContext = createContext();

const favoritesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FAVORITES':
      return {
        ...state,
        favorites: new Set(action.payload),
        loading: false
      };
    case 'ADD_FAVORITE':
      return {
        ...state,
        favorites: new Set([...state.favorites, action.payload])
      };
    case 'REMOVE_FAVORITE':
      const newFavorites = new Set(state.favorites);
      newFavorites.delete(action.payload);
      return {
        ...state,
        favorites: newFavorites
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
      const favoriteIds = favoriteMeals.map(meal => meal.id);
      dispatch({ type: 'SET_FAVORITES', payload: favoriteIds });
    } catch (error) {
      console.error('Failed to load favorites:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load favorites' });
    }
  };

  const addToFavorites = async (mealId) => {
    try {
      await apiAddFavorite(mealId);
      dispatch({ type: 'ADD_FAVORITE', payload: mealId });
      
      // Show success feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Failed to add to favorites:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add to favorites' });
      return { success: false, error: error.message };
    }
  };

  const removeFromFavorites = async (mealId) => {
    try {
      await apiRemoveFavorite(mealId);
      dispatch({ type: 'REMOVE_FAVORITE', payload: mealId });
      return { success: true };
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove from favorites' });
      return { success: false, error: error.message };
    }
  };

  const toggleFavorite = async (mealId) => {
    if (state.favorites.has(mealId)) {
      return await removeFromFavorites(mealId);
    } else {
      return await addToFavorites(mealId);
    }
  };

  const isFavorite = (mealId) => state.favorites.has(mealId);

  return (
    <FavoritesContext.Provider value={{
      ...state,
      addToFavorites,
      removeFromFavorites,
      toggleFavorite,
      isFavorite,
      loadFavorites
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
