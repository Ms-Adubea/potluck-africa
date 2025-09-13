// 📁 src/components/admin/AdminNotificationPanel.jsx - Admin panel integration
import React from 'react';
import { Users, Bell, Settings, BarChart3 } from 'lucide-react';
import BroadcastPanel from './BroadcastPanel';
import NotificationManager from '../../components/notifications/NotificationManager';

const AdminNotificationPanel = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Settings className="h-6 w-6 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Notification Management
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">Active Subscribers</p>
                <p className="text-2xl font-bold text-blue-600">1,234</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">Sent Today</p>
                <p className="text-2xl font-bold text-green-600">89</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-900">Click Rate</p>
                <p className="text-2xl font-bold text-purple-600">67%</p>
              </div>
            </div>
          </div>
        </div>

        <NotificationManager isAdmin={true} />
      </div>

      <BroadcastPanel />
    </div>
  );
};

export default AdminNotificationPanel; 
