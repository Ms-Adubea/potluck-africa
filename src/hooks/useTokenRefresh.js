// 📁 src/hooks/useTokenRefresh.js - Create this new file
import { useEffect, useRef } from 'react';
import { refreshAccessToken, isTokenExpiringSoon, isAuthenticated } from '../services/auth';

export const useTokenRefresh = () => {
  const intervalRef = useRef(null);

  useEffect(() => {
    // Only set up token refresh if user is authenticated
    if (!isAuthenticated()) {
      return;
    }

    // Function to check and refresh token if needed
    const checkAndRefreshToken = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token && isTokenExpiringSoon(token)) {
          console.log('Token expiring soon, refreshing proactively...');
          await refreshAccessToken();
        }
      } catch (error) {
        console.error('Proactive token refresh failed:', error);
        // Error is handled in refreshAccessToken function
      }
    };

    // Check immediately on mount
    checkAndRefreshToken();

    // Set up interval to check every 5 minutes (300000ms)
    intervalRef.current = setInterval(checkAndRefreshToken, 5 * 60 * 1000);

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run on mount/unmount

  // Return a manual refresh function in case components need it
  const manualRefresh = async () => {
    try {
      await refreshAccessToken();
      return true;
    } catch (error) {
      console.error('Manual token refresh failed:', error);
      return false;
    }
  };

  return { manualRefresh };
};