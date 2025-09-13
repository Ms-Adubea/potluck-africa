// 📁 src/hooks/usePotchefNotifications.js - Hook for potchef-specific notifications
import { useCallback } from 'react';
import { apiSendNotification } from '../services/notifications';

export const usePotchefNotifications = () => {
  // Send order notification to potchef
  const sendOrderNotification = useCallback(async (order) => {
    try {
      const notificationData = {
        title: 'New Order Received! 🍽️',
        body: `Order #${order._id?.slice(-8)} from ${order.buyer?.firstName} - ₵${order.totalPrice}`,
        icon: '/logo-192.png',
        url: 'https://potluck.africa/orders'
      };

      await apiSendNotification(notificationData);
      return true;
    } catch (error) {
      console.error('Error sending order notification:', error);
      return false;
    }
  }, []);

  // Send order status update to customer
  const sendStatusUpdateNotification = useCallback(async (order, status) => {
    try {
      const statusMessages = {
        'preparing': 'Your order is being prepared 👨‍🍳',
        'ready': 'Your meal is now READY 🍲',
        'completed': 'Order completed! Thank you for choosing us ✅'
      };

      const notificationData = {
        title: 'Order Status Update',
        body: statusMessages[status] || `Your order has been updated to ${status}`,
        icon: '/logo-192.png',
        url: 'https://potluck.africa/orders'
      };

      await apiSendNotification(notificationData);
      return true;
    } catch (error) {
      console.error('Error sending status update notification:', error);
      return false;
    }
  }, []);

  return {
    sendOrderNotification,
    sendStatusUpdateNotification
  };
};
