// hooks/useOfflineSync.js - Custom hook for offline functionality
import { useState, useEffect } from 'react';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingActions, setPendingActions] = useState([]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingActions();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addPendingAction = (action) => {
    setPendingActions(prev => [...prev, action]);
    localStorage.setItem('pendingActions', JSON.stringify([...pendingActions, action]));
  };

  const syncPendingActions = async () => {
    const stored = localStorage.getItem('pendingActions');
    const actions = stored ? JSON.parse(stored) : [];

    for (const action of actions) {
      try {
        switch (action.type) {
          case 'ADD_FAVORITE':
            await apiAddFavorite(action.mealId);
            break;
          case 'REMOVE_FAVORITE':
            await apiRemoveFavorite(action.mealId);
            break;
          case 'CREATE_ORDER':
            await apiCreateOrder(action.orderData);
            break;
          default:
            break;
        }
      } catch (error) {
        console.error('Failed to sync action:', error);
      }
    }

    // Clear synced actions
    localStorage.removeItem('pendingActions');
    setPendingActions([]);
  };

  return {
    isOnline,
    addPendingAction,
    pendingActions: pendingActions.length
  };
};
