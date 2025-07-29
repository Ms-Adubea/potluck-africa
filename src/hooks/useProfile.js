// 📁 src/hooks/useProfile.js
import { useState, useEffect, useCallback } from 'react';
import { 
  apiGetProfile, 
  apiUpdateProfile, 
  apiUpdateProfilePicture,
  getCurrentUser 
} from '../services/auth';
import { validateImageFile } from '../utils/profilePictureUtils';

export const useProfile = (currentRole) => {
  const [profileData, setProfileData] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load profile data
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const userData = await apiGetProfile();
      
      // Map API response to local state
      const mappedData = {
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        joinDate: userData.createdAt || new Date().toISOString(),
        bio: userData.bio || '',
        // Role-specific fields
        ...getRoleSpecificFields(userData, currentRole)
      };
      
      setProfileData(mappedData);
      
      // Set profile picture
      if (userData.profilePicture || userData.avatar) {
        setProfilePicture(userData.profilePicture || userData.avatar);
      }
      
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile data. Please try again.');
      
      // Fallback to current user data
      loadFromCurrentUser();
    } finally {
      setLoading(false);
    }
  }, [currentRole]);

  // Fallback to current user data
  const loadFromCurrentUser = useCallback(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        joinDate: currentUser.createdAt || new Date().toISOString(),
        bio: currentUser.bio || '',
        ...getRoleSpecificFields(currentUser, currentRole)
      });
      
      if (currentUser.profilePicture) {
        setProfilePicture(currentUser.profilePicture);
      }
    }
  }, [currentRole]);

  // Get role-specific fields from data
  const getRoleSpecificFields = (userData, role) => {
    const roleFields = {
      potchef: {
        specialty: userData.specialty || '',
        experience: userData.experience || '',
        rating: userData.rating || '0',
        totalMeals: userData.totalMeals || '0'
      },
      potlucky: {
        favoritesCuisine: userData.favoritesCuisine || '',
        dietaryRestrictions: userData.dietaryRestrictions || '',
        totalOrders: userData.totalOrders || '0'
      },
      franchisee: {
        franchise: userData.franchise || '',
        territory: userData.territory || '',
        yearsActive: userData.yearsActive || '0'
      },
      admin: {
        department: userData.department || '',
        permissions: userData.permissions || 'Standard'
      }
    };
    return roleFields[role] || {};
  };

  // Update profile field
  const updateField = useCallback((field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Save profile changes
  const saveProfile = useCallback(async (updatedData = null) => {
    try {
      setSaving(true);
      setError('');
      
      // Use provided data or current profileData
      const dataToUpdate = updatedData || profileData;
      
      // Prepare update data
      const updateData = {
        name: dataToUpdate.name,
        email: dataToUpdate.email,
        phone: dataToUpdate.phone,
        address: dataToUpdate.address,
        bio: dataToUpdate.bio,
        // Include role-specific fields
        ...getRoleSpecificUpdateData(dataToUpdate, currentRole)
      };

      // Update profile via API
      const response = await apiUpdateProfile(updateData);
      
      // Update local state with response
      const updatedProfileData = {
        ...dataToUpdate,
        ...response
      };
      setProfileData(updatedProfileData);
      
      setSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
      return response;
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
      throw error;
    } finally {
      setSaving(false);
    }
  }, [profileData, currentRole]);

  // Update profile picture
  const updateProfilePicture = useCallback(async (file) => {
    try {
      setSaving(true);
      setError('');
      
      // Validate file
      validateImageFile(file);
      
      // Update profile picture via API
      const response = await apiUpdateProfilePicture(file);
      
      // Update local state
      const newPictureUrl = response.avatar || response.profilePicture;
      setProfilePicture(newPictureUrl);
      
      setSuccess('Profile picture updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
      return response;
      
    } catch (error) {
      console.error('Error updating profile picture:', error);
      
      if (error.message.includes('Please select a valid image') || 
          error.message.includes('Image file size')) {
        setError(error.message);
      } else {
        setError('Failed to update profile picture. Please try again.');
      }
      
      throw error;
    } finally {
      setSaving(false);
    }
  }, []);

  // Get role-specific data for API update
  const getRoleSpecificUpdateData = (data, role) => {
    const roleData = {};
    const roleFields = {
      potchef: ['specialty', 'experience'],
      potlucky: ['favoritesCuisine', 'dietaryRestrictions'],
      franchisee: ['franchise', 'territory', 'yearsActive'],
      admin: ['department']
    };

    if (roleFields[role]) {
      roleFields[role].forEach(field => {
        if (data[field] !== undefined) {
          roleData[field] = data[field];
        }
      });
    }

    return roleData;
  };

  // Clear messages
  const clearMessages = useCallback(() => {
    setError('');
    setSuccess('');
  }, []);

  // Refresh profile data
  const refreshProfile = useCallback(() => {
    loadProfile();
  }, [loadProfile]);

  // Load profile on mount and role change
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    // Data
    profileData,
    profilePicture,
    
    // States
    loading,
    saving,
    error,
    success,
    
    // Actions
    updateField,
    saveProfile,
    updateProfilePicture,
    refreshProfile,
    clearMessages,
    
    // Utils
    getRoleSpecificFields
  };
};