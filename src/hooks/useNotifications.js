// 📁 src/hooks/useNotifications.js - Custom hook for managing notifications
import { useState, useEffect, useCallback } from "react";
import {
  apiGetNotifications,
  apiGetNotificationsCount,
  apiMarkNotificationAsRead,
  apiMarkAllNotificationsAsRead,
  apiDeleteNotification,
  apiSubscribeToNotifications,
  apiUnsubscribeFromNotifications,
  apiSendNotification,
  apiBroadcastNotification,
} from "../services/notifications";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiGetNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const data = await apiGetNotificationsCount();
      setUnreadCount(data.count || 0);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await apiMarkNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await apiMarkAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(
    async (notificationId) => {
      try {
        await apiDeleteNotification(notificationId);
        setNotifications((prev) =>
          prev.filter((notif) => notif.id !== notificationId)
        );
        // Fetch updated count
        fetchUnreadCount();
      } catch (error) {
        console.error("Error deleting notification:", error);
      }
    },
    [fetchUnreadCount]
  );

  // Subscribe to push notifications
  const subscribeToPush = useCallback(async () => {
    try {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          throw new Error("Notification permission denied");
        }

        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY,
        });

        await apiSubscribeToNotifications(subscription);
        setIsSubscribed(true);
        localStorage.setItem("pushSubscribed", "true");
      }
    } catch (error) {
      console.error("Error subscribing to push notifications:", error);
    }
  }, []);

  // Unsubscribe from push notifications
  const unsubscribeFromPush = useCallback(async () => {
    try {
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
          await subscription.unsubscribe();
          await apiUnsubscribeFromNotifications(subscription.endpoint);
        }

        setIsSubscribed(false);
        localStorage.setItem("pushSubscribed", "false");
      }
    } catch (error) {
      console.error("Error unsubscribing from push notifications:", error);
    }
  }, []);

  const sendNotification = useCallback(
    async (notificationData) => {
      try {
        await apiSendNotification(notificationData);
        // Optionally refresh notifications after sending
        fetchNotifications();
      } catch (error) {
        console.error("Error sending notification:", error);
        throw error;
      }
    },
    [fetchNotifications]
  );

  const broadcastNotification = useCallback(async (broadcastData) => {
    try {
      await apiBroadcastNotification(broadcastData);
    } catch (error) {
      console.error("Error broadcasting notification:", error);
      throw error;
    }
  }, []);

  // Initialize notifications on mount
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();

    // Check if user is subscribed to push notifications
    const pushSubscribed = localStorage.getItem("pushSubscribed");
    setIsSubscribed(pushSubscribed === "true");
  }, [fetchNotifications, fetchUnreadCount]);

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    isSubscribed,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    subscribeToPush,
    unsubscribeFromPush,
    sendNotification,
    broadcastNotification,
  };
};
