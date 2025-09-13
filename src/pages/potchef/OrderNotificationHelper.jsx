// 📁 src/components/potchef/OrderNotificationHelper.jsx - Component for potchef order notifications
import React, { useState } from 'react';
import { Bell, Send, Check, AlertCircle } from 'lucide-react';
import { usePotchefNotifications } from '../../hooks/usePotchefNotifications';

const OrderNotificationHelper = ({ order }) => {
  const [isNotifying, setIsNotifying] = useState(false);
  const [lastNotified, setLastNotified] = useState(null);
  const { sendStatusUpdateNotification } = usePotchefNotifications();

  const handleStatusNotification = async (status) => {
    setIsNotifying(true);
    
    const success = await sendStatusUpdateNotification(order, status);
    
    if (success) {
      setLastNotified({ status, timestamp: new Date() });
      // Show success feedback
      setTimeout(() => setLastNotified(null), 3000);
    }
    
    setIsNotifying(false);
  };

  const getStatusMessage = (status) => {
    const messages = {
      'preparing': 'Notify customer: Order is being prepared',
      'ready': 'Notify customer: Meal is ready for pickup',
      'completed': 'Notify customer: Order completed'
    };
    return messages[status] || `Notify about ${status}`;
  };

  return (
    <div className="bg-white rounded-lg border p-4 space-y-3">
      <div className="flex items-center space-x-2">
        <Bell className="w-5 h-5 text-blue-600" />
        <h3 className="font-medium text-gray-900">Customer Notifications</h3>
      </div>
      
      {lastNotified && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center space-x-2">
          <Check className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-800">
            Customer notified about {lastNotified.status} status
          </span>
        </div>
      )}

      <div className="space-y-2">
        {['preparing', 'ready', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => handleStatusNotification(status)}
            disabled={isNotifying}
            className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <span className="text-sm text-gray-700">
              {getStatusMessage(status)}
            </span>
            <div className="flex items-center space-x-2">
              {isNotifying ? (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="text-xs text-gray-500 flex items-center space-x-1">
        <AlertCircle className="w-3 h-3" />
        <span>Notifications are sent instantly to the customer</span>
      </div>
    </div>
  );
};

export default OrderNotificationHelper;
