// 📁 src/components/common/NotificationTestPanel.jsx - Development component for testing
import React from 'react';
import { Bell, Send, TestTube } from 'lucide-react';
import { useNotificationContext } from '../../contexts/NotificationContext';
import { showBrowserNotification } from '../../utils/notificationUtils';
import { 
  createOrderNotification, 
  createStatusUpdateNotification,
  createPromotionNotification,
  createSystemNotification 
} from '../../utils/notificationHelpers';

const NotificationTestPanel = () => {
  const { subscribeToPush, isSubscribed } = useNotificationContext();

  const testNotifications = [
    {
      name: 'Order Received',
      action: () => {
        const mockOrder = {
          _id: '507f1f77bcf86cd799439011',
          buyer: { firstName: 'John' },
          totalPrice: 25.50
        };
        const notification = createOrderNotification(mockOrder);
        showBrowserNotification(notification.title, notification);
      }
    },
    {
      name: 'Order Status Update',
      action: () => {
        const mockOrder = { _id: '507f1f77bcf86cd799439011' };
        const notification = createStatusUpdateNotification(mockOrder, 'Ready');
        showBrowserNotification(notification.title, notification);
      }
    },
    {
      name: 'Promotion',
      action: () => {
        const mockPromotion = { 
          message: 'Get 20% off your next order! Limited time offer.' 
        };
        const notification = createPromotionNotification(mockPromotion);
        showBrowserNotification(notification.title, notification);
      }
    },
    {
      name: 'System Update',
      action: () => {
        const notification = createSystemNotification('App updated with new features!');
        showBrowserNotification(notification.title, notification);
      }
    }
  ];

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border p-4 max-w-xs">
      <div className="flex items-center space-x-2 mb-3">
        <TestTube className="w-4 h-4 text-orange-500" />
        <h3 className="font-semibold text-sm">Notification Tests</h3>
      </div>
      
      <div className="space-y-2">
        {!isSubscribed && (
          <button
            onClick={subscribeToPush}
            className="w-full bg-orange-100 text-orange-700 px-3 py-2 rounded text-xs hover:bg-orange-200 transition-colors"
          >
            <Bell className="w-3 h-3 inline mr-1" />
            Subscribe First
          </button>
        )}
        
        {testNotifications.map((test, index) => (
          <button
            key={index}
            onClick={test.action}
            className="w-full bg-gray-100 text-gray-700 px-3 py-2 rounded text-xs hover:bg-gray-200 transition-colors"
          >
            <Send className="w-3 h-3 inline mr-1" />
            {test.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NotificationTestPanel;