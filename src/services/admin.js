import { apiClient } from "./config";

// GET all users from the server
export const apiGetAllUsers = async () => {
  try {
    const response = await apiClient.get('/admin/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error.response?.data || error.message);
    throw error;
  }
};

// DELETE a user by ID
export const apiDeleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`/admin/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error.response?.data || error.message);
    throw error;
  }
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