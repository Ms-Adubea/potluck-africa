// 📁 src/utils/notificationUtils.js - Utility functions for notifications
export const showBrowserNotification = (title, options = {}) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      ...options
    });

    notification.onclick = function() {
      window.focus();
      if (options.url) {
        window.location.href = options.url;
      }
      notification.close();
    };

    // Auto close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);
  }
};

export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};
