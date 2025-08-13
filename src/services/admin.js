import { apiClient } from "./config";

// ===== USER MANAGEMENT =====

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

// ===== FRANCHISEE MANAGEMENT =====

// POST add new franchisee
export const apiAddFranchisee = async (formData) => {
  const response = await apiClient.post('/franchisees', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// GET one franchisee
export const apiGetFranchiseeById = async (franchiseeId) => {
  const response = await apiClient.get(`/franchisees/${franchiseeId}`);
  return response.data;
};

// PATCH update franchisee text data
export const apiUpdateFranchiseeText = async (franchiseeId, data) => {
  const response = await apiClient.patch(`/franchisees/${franchiseeId}/text`, data);
  return response.data;
};

// PATCH update franchisee images
export const apiUpdateFranchiseeImages = async (franchiseeId, formData) => {
  const response = await apiClient.patch(`/franchisees/${franchiseeId}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// GET all franchisees
export const apiGetAllFranchisees = async () => {
  const response = await apiClient.get('/franchisees');
  return response.data;
};

// PATCH remove specific franchisee images (replace the existing apiDeleteFranchisee function)
export const apiRemoveFranchiseeImages = async (franchiseeId, imageUrls) => {
  const response = await apiClient.patch(`/franchisees/${franchiseeId}/remove-images`, {
    imageUrls: imageUrls  // Send array of image URLs to be deleted
  });
  return response.data;
};

// GET single franchisee (alias for consistency)
export const apiGetFranchisee = async (franchiseeId) => {
  const response = await apiClient.get(`/franchisees/${franchiseeId}`);
  return response.data;
};