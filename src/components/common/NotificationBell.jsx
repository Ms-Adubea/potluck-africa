// 📁 src/components/common/NotificationBell.jsx - Fixed with higher z-index values
import React, { useState } from "react";
import { Bell, X, Check, CheckCheck, Trash2, Settings } from "lucide-react";
import { useNotifications } from "../../hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../services/auth";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
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
  } = useNotifications();

  const formatTime = (dateString) => {
    const now = new Date();
    const notifDate = new Date(dateString);
    const diffInHours = Math.floor((now - notifDate) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - notifDate) / (1000 * 60));
      return diffInMinutes <= 1 ? "Just now" : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "order":
        return "🍽️";
      case "system":
        return "⚙️";
      case "promotion":
        return "🎉";
      case "reminder":
        return "⏰";
      default:
        return "📢";
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // Handle navigation if URL is provided
    if (notification.url) {
      window.location.href = notification.url;
    }
  };

  const togglePushNotifications = () => {
    if (isSubscribed) {
      unsubscribeFromPush();
    } else {
      subscribeToPush();
    }
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          </div>
        )}
      </button>

      {/* Notification Dropdown - INCREASED Z-INDEX */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-50"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute top-12 z-[100] max-h-[32rem] overflow-hidden
                        /* Mobile: centered and full-width with margins */
                        left-1/2 transform -translate-x-1/2 w-[calc(100vw-2rem)] max-w-sm
                        /* Tablet and up: positioned to the right */
                        sm:left-auto sm:right-0 sm:transform-none sm:translate-x-0 sm:w-96 sm:max-w-none
                        bg-white rounded-xl shadow-2xl border border-gray-100">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <p className="text-sm text-gray-600">
                    {unreadCount > 0
                      ? `${unreadCount} unread`
                      : "All caught up!"}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Push Notification Toggle */}
                  <button
                    onClick={togglePushNotifications}
                    className={`p-2 rounded-lg transition-colors ${
                      isSubscribed
                        ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    title={
                      isSubscribed
                        ? "Disable push notifications"
                        : "Enable push notifications"
                    }
                  >
                    <Settings className="w-4 h-4" />
                  </button>

                  {/* Mark All as Read */}
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}

                  {/* Close Button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                  <p className="text-gray-500 text-sm mt-2">
                    Loading notifications...
                  </p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">
                    No notifications yet
                  </p>
                  <p className="text-gray-400 text-sm">
                    We'll notify you when something happens
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer group ${
                        !notification.isRead ? "bg-blue-50" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-sm">
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p
                                className={`text-sm font-medium ${
                                  !notification.isRead
                                    ? "text-gray-900"
                                    : "text-gray-700"
                                }`}
                              >
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {notification.body}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {formatTime(notification.createdAt)}
                              </p>
                            </div>

                            <div className="flex items-center space-x-1 ml-2">
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 rounded transition-all"
                                title="Delete notification"
                              >
                                <Trash2 className="w-3 h-3" />
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

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate based on user role
                    const user = getCurrentUser(); // Use the imported function
                    const userRole = user?.role || "potlucky"; // Default role
                    navigate(`/dashboard/${userRole}/notifications`);
                  }}
                  className="w-full text-center text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  View All Notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;