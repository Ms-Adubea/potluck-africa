// 📁 src/hooks/useNotificationSync.js - Hook for handling service worker messages
import { useEffect } from 'react';
import { useNotificationContext } from '../contexts/NotificationContext';

export const useNotificationSync = () => {
  const { fetchUnreadCount, markAsRead } = useNotificationContext();

  useEffect(() => {
    // Listen for service worker messages
    const handleServiceWorkerMessage = (event) => {
      const { data } = event;
      
      switch (data.type) {
        case 'PUSH_RECEIVED':
          // Refresh notification count when push is received
          fetchUnreadCount();
          break;
          
        case 'MARK_NOTIFICATION_READ':
          // Mark notification as read when clicked from notification
          if (data.notificationId) {
            markAsRead(data.notificationId);
          }
          break;
          
        default:
          break;
      }
    };

    // Listen for refresh notifications custom event
    const handleRefreshNotifications = () => {
      fetchUnreadCount();
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    }
    
    window.addEventListener('refreshNotifications', handleRefreshNotifications);

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      }
      window.removeEventListener('refreshNotifications', handleRefreshNotifications);
    };
  }, [fetchUnreadCount, markAsRead]);
};