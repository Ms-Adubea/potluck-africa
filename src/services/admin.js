import { apiClient } from "./config";

// GET all users
export const apiGetAllUsers = async () => {
  const response = await apiClient.get('/admin/users');
  return response.data;
};

// GET one user
export const apiGetUserById = async (userId) => {
  const response = await apiClient.get(`/users/${userId}`);
  return response.data;
};

// DELETE user
export const apiDeleteUser = async (userId) => {
  const response = await apiClient.delete(`/admin/${userId}`);
  return response.data;
};


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