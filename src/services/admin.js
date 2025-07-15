import { apiClient } from "./config";

// GET pending user
export const apiGetAllPendingUsers = async () => {
  const res = await apiClient.get('/admin/pending-users');
  return res.data;
};

// PATCH update user
export const apiApproveUser = async (id, data) => {
  const res = await apiClient.patch(`/admin/users/${id}/approval`, data);
  return res.data;
};

//GET one pending user
export const apiGetOnePendingUser = async (id) => {
  const res = await apiClient.get(`/admin/pending-users/${id}`);
  return res.data;
};