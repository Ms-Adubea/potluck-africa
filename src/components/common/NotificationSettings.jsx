// 📁 src/components/common/NotificationSettings.jsx - Settings component for notifications
import React from 'react';
import { Bell, Smartphone, Mail, Shield } from 'lucide-react';
import { useNotificationContext } from '../../contexts/NotificationContext';

const NotificationSettings = () => {
  const { isSubscribed, subscribeToPush, unsubscribeFromPush } = useNotificationContext();

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Bell className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-800">Push Notifications</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-700">Browser Notifications</p>
            <p className="text-sm text-gray-500">
              Receive real-time notifications in your browser
            </p>
          </div>
          <button
            onClick={isSubscribed ? unsubscribeFromPush : subscribeToPush}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isSubscribed
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
            }`}
          >
            {isSubscribed ? 'Disable' : 'Enable'}
          </button>
        </div>
        
        <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Privacy Note</span>
          </div>
          <p>
            Push notifications are sent directly to your device. 
            We only send notifications for important updates and never share 
            your notification preferences with third parties.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
