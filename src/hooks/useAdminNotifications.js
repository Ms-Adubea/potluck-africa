// 📁 src/hooks/useAdminNotifications.js - Hook for admin broadcast capabilities
import { useCallback } from 'react';
import { apiBroadcastNotification } from '../services/notifications';

export const useAdminNotifications = () => {
  // Send system-wide announcements
  const sendSystemAnnouncement = useCallback(async (title, message, url = 'https://potluck.app/dashboard') => {
    try {
      const broadcastData = {
        title,
        body: message,
        url
      };

      await apiBroadcastNotification(broadcastData);
      return true;
    } catch (error) {
      console.error('Error sending system announcement:', error);
      return false;
    }
  }, []);

  // Send promotional broadcasts
  const sendPromotionalBroadcast = useCallback(async (promotion) => {
    try {
      const broadcastData = {
        title: `🎉 ${promotion.title}`,
        body: promotion.message,
        url: promotion.url || 'https://potluck.africa'
      };

      await apiBroadcastNotification(broadcastData);
      return true;
    } catch (error) {
      console.error('Error sending promotional broadcast:', error);
      return false;
    }
  }, []);

  // Send maintenance notifications
  const sendMaintenanceNotification = useCallback(async (maintenanceInfo) => {
    try {
      const broadcastData = {
        title: '⚙️ Scheduled Maintenance',
        body: `System maintenance scheduled: ${maintenanceInfo.message}`,
        url: 'https://potluck.app/dashboard'
      };

      await apiBroadcastNotification(broadcastData);
      return true;
    } catch (error) {
      console.error('Error sending maintenance notification:', error);
      return false;
    }
  }, []);

  return {
    sendSystemAnnouncement,
    sendPromotionalBroadcast,
    sendMaintenanceNotification
  };
};