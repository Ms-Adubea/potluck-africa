import { apiClient } from './config';

// FOR SYSTEM PUSH POP UP
export const apiSubscribeToNotifications = async (subscription) => {
  const response = await apiClient.post('/subscribe', subscription);
  return response.data;
};

export const apiUnsubscribeFromNotifications = async (endpoint) => {
  const response = await apiClient.post('/unsubscribe', { endpoint });
  return response.data;
};

export const apiSendNotification = async (notificationData) => {
  const response = await apiClient.post('/notify', notificationData);
  return response.data;
};

export const apiBroadcastNotification = async (broadcastData) => {
  const response = await apiClient.post('/broadcast', broadcastData);
  return response.data;
};

// FOR BELL NOTIFICATION ICON
export const apiGetNotifications = async () => {
  const response = await apiClient.get('/notifications');
  return response.data;
};

export const apiGetNotificationsCount = async () => {
  const response = await apiClient.get('/notifications/count');
  return response.data;
};

export const apiMarkNotificationAsRead = async (notificationId) => {
  const response = await apiClient.patch(`/notifications/${notificationId}/read`);
  return response.data;
};

export const apiMarkAllNotificationsAsRead = async () => {
  const response = await apiClient.patch('/notifications/read-all');
  return response.data;
};

export const apiDeleteNotification = async (notificationId) => {
  const response = await apiClient.delete(`/notifications/${notificationId}/delete`);
  return response.data;
};

export const apiDeleteAllNotifications = async () => {
  const response = await apiClient.delete('/notifications/delete-all');
  return response.data;
};