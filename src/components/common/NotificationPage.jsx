// 📁 src/pages/common/NotificationsPage.jsx - Full notifications management page
import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  Filter, 
  Search, 
  Check, 
  CheckCheck, 
  Trash2, 
  Archive, 
  Settings,
  ChevronDown,
  Calendar,
  Clock,
  X,
  RefreshCw
} from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';

const NotificationsPage = () => {
  const {
    notifications,
    unreadCount,
    loading,
    isSubscribed,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    subscribeToPush,
    unsubscribeFromPush,
    refreshNotifications
  } = useNotifications();

  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterRead, setFilterRead] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Filter and sort notifications
  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(notif => 
        notif.type?.toLowerCase() === filterType.toLowerCase()
      );
    }

    // Filter by read status
    if (filterRead !== 'all') {
      filtered = filtered.filter(notif => 
        filterRead === 'read' ? notif.isRead : !notif.isRead
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(notif =>
        notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notif.body.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort notifications
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      
      switch (sortBy) {
        case 'newest':
          return dateB - dateA;
        case 'oldest':
          return dateA - dateB;
        case 'unread':
          if (a.isRead !== b.isRead) {
            return a.isRead ? 1 : -1;
          }
          return dateB - dateA;
        default:
          return dateB - dateA;
      }
    });

    return filtered;
  }, [notifications, filterType, filterRead, searchTerm, sortBy]);

  const formatTime = (dateString) => {
    const now = new Date();
    const notifDate = new Date(dateString);
    const diffInHours = Math.floor((now - notifDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - notifDate) / (1000 * 60));
      return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) { // Less than a week
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    } else {
      return notifDate.toLocaleDateString();
    }
  };

  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'order':
        return '🍽️';
      case 'system':
        return '⚙️';
      case 'promotion':
        return '🎉';
      case 'reminder':
        return '⏰';
      case 'message':
        return '💬';
      case 'update':
        return '🔄';
      default:
        return '📢';
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'order':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'system':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'promotion':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'reminder':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'message':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'update':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId) 
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    setSelectedNotifications(
      selectedNotifications.length === filteredNotifications.length 
        ? [] 
        : filteredNotifications.map(n => n.id)
    );
  };

  const handleBulkMarkAsRead = () => {
    selectedNotifications.forEach(id => {
      const notification = notifications.find(n => n.id === id);
      if (notification && !notification.isRead) {
        markAsRead(id);
      }
    });
    setSelectedNotifications([]);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedNotifications.length} notification(s)?`)) {
      selectedNotifications.forEach(id => deleteNotification(id));
      setSelectedNotifications([]);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    if (notification.url) {
      window.location.href = notification.url;
    }
  };

  const clearFilters = () => {
    setFilterType('all');
    setFilterRead('all');
    setSearchTerm('');
    setSortBy('newest');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filterType !== 'all') count++;
    if (filterRead !== 'all') count++;
    if (searchTerm) count++;
    if (sortBy !== 'newest') count++;
    return count;
  };

  const notificationTypes = [...new Set(notifications.map(n => n.type).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Bell className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                  <p className="text-gray-600">
                    {unreadCount > 0 ? `${unreadCount} unread of ${notifications.length} total` : 'All caught up!'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={refreshNotifications}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Refresh notifications"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    showFilters || getActiveFiltersCount() > 0
                      ? 'bg-orange-100 text-orange-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                  {getActiveFiltersCount() > 0 && (
                    <span className="bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            {/* Push Notification Status */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Settings className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Push Notifications</span>
              </div>
              <button
                onClick={isSubscribed ? unsubscribeFromPush : subscribeToPush}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  isSubscribed
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isSubscribed ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Type Filter */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  {notificationTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>

                {/* Read Status Filter */}
                <select
                  value={filterRead}
                  onChange={(e) => setFilterRead(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="unread">Unread Only</option>
                  <option value="read">Read Only</option>
                </select>

                {/* Sort By */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="unread">Unread First</option>
                </select>
              </div>

              {getActiveFiltersCount() > 0 && (
                <div className="mt-3">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedNotifications.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-700">
                {selectedNotifications.length} notification(s) selected
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBulkMarkAsRead}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Mark as Read</span>
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
                <button
                  onClick={() => setSelectedNotifications([])}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {notifications.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleSelectAll}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                  onChange={() => {}}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span>Select All</span>
              </button>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Mark All Read</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterType !== 'all' || filterRead !== 'all' 
                  ? 'No matching notifications' 
                  : 'No notifications yet'
                }
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterType !== 'all' || filterRead !== 'all'
                  ? 'Try adjusting your filters to see more notifications.'
                  : "We'll notify you when something happens."
                }
              </p>
              {(searchTerm || filterType !== 'all' || filterRead !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 transition-colors group ${
                    !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  } ${selectedNotifications.includes(notification.id) ? 'bg-orange-50' : ''}`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Checkbox */}
                    <div className="mt-1">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={() => handleSelectNotification(notification.id)}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                    </div>

                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-lg">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 cursor-pointer" onClick={() => handleNotificationClick(notification)}>
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className={`text-lg font-semibold ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h3>
                            {notification.type && (
                              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(notification.type)}`}>
                                {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                              </span>
                            )}
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          
                          <p className="text-gray-600 mb-3 leading-relaxed">
                            {notification.body}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatTime(notification.createdAt)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span title={formatFullDate(notification.createdAt)}>
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center space-x-1 ml-4">
                          {!notification.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('Are you sure you want to delete this notification?')) {
                                deleteNotification(notification.id);
                              }
                            }}
                            className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all"
                            title="Delete notification"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination or Load More */}
        {filteredNotifications.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Showing {filteredNotifications.length} of {notifications.length} notifications
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;