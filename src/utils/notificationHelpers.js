// 📁 src/utils/notificationHelpers.js - Helper functions for different notification types
export const createOrderNotification = (order) => ({
  title: 'New Order Received! 🍽️',
  body: `Order #${order._id.slice(-8)} from ${order.buyer.firstName} - ₵${order.totalPrice}`,
  icon: '/icons/icon-192x192.png',
  badge: '/icons/icon-72x72.png',
  tag: 'order',
  data: {
    url: `/dashboard/potchef/orders`,
    orderId: order._id,
    type: 'order'
  },
  actions: [
    {
      action: 'view',
      title: 'View Order',
      icon: '/icons/view-icon.png'
    },
    {
      action: 'dismiss',
      title: 'Dismiss',
      icon: '/icons/dismiss-icon.png'
    }
  ],
  requireInteraction: true
});

export const createStatusUpdateNotification = (order, status) => ({
  title: `Order ${status} ✅`,
  body: `Your order #${order._id.slice(-8)} has been ${status.toLowerCase()}`,
  icon: '/icons/icon-192x192.png',
  tag: 'order-status',
  data: {
    url: `/dashboard/potlucky/orders`,
    orderId: order._id,
    type: 'order-status'
  }
});

export const createPromotionNotification = (promotion) => ({
  title: '🎉 Special Offer!',
  body: promotion.message,
  icon: '/icons/icon-192x192.png',
  tag: 'promotion',
  data: {
    url: promotion.url || '/dashboard/potlucky/browse',
    type: 'promotion'
  }
});

export const createSystemNotification = (message) => ({
  title: '⚙️ System Update',
  body: message,
  icon: '/icons/icon-192x192.png',
  tag: 'system',
  data: {
    url: '/dashboard',
    type: 'system'
  }
});