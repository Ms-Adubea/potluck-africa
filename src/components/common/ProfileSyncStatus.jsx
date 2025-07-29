// 📁 src/components/common/ProfileSyncStatus.jsx - Profile sync status component
import React from 'react';
import { CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react';

const ProfileSyncStatus = ({ lastSynced, isLoading, error, onSync }) => {
  const getStatusIcon = () => {
    if (isLoading) {
      return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />;
    }
    if (error) {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    if (lastSynced) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    return <Clock className="w-4 h-4 text-gray-400" />;
  };

  const getStatusText = () => {
    if (isLoading) return 'Syncing...';
    if (error) return 'Sync failed';
    if (lastSynced) {
      const timeDiff = new Date() - new Date(lastSynced);
      const minutes = Math.floor(timeDiff / 60000);
      if (minutes < 1) return 'Just synced';
      if (minutes < 60) return `Synced ${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      return `Synced ${hours}h ago`;
    }
    return 'Not synced';
  };

  const getStatusColor = () => {
    if (isLoading) return 'text-blue-600';
    if (error) return 'text-red-600';
    if (lastSynced) return 'text-green-600';
    return 'text-gray-500';
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-2">
        {getStatusIcon()}
        <span className={`text-sm ${getStatusColor()}`}>
          {getStatusText()}
        </span>
        {error && (
          <span className="text-xs text-gray-500">
            - {error}
          </span>
        )}
      </div>
      {!isLoading && (
        <button
          onClick={onSync}
          className="text-xs text-blue-600 hover:text-blue-700 underline"
        >
          Sync now
        </button>
      )}
    </div>
  );
};

export default ProfileSyncStatus;
