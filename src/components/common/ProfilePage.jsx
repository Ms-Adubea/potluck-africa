// 📁 src/components/common/ProfilePage.jsx - Enhanced UI for food web app PWA with Password Change and Header Sync
import React, { useState, useEffect } from 'react';
import { Camera, Edit2, Save, X, MapPin, Phone, Mail, Calendar, Shield, Loader, User, ChefHat, Heart, Crown, Settings, Lock, Eye, EyeOff, Key } from 'lucide-react';
import { apiGetProfile, apiUpdateProfile, apiUpdateProfilePicture, apiChangePassword } from '../../services/auth';

const ProfilePage = ({ currentRole }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Load user data on component mount
  useEffect(() => {
    loadUserProfile();
  }, [currentRole]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      const userData = await apiGetProfile();
      
      // Map API response to local state (matching your backend model)
      const mappedData = {
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
        email: userData.email || '',
        phone: userData.phone || '',
        joinDate: userData.createdAt || new Date().toISOString(),
        role: userData.role || currentRole,
        isApproved: userData.isApproved || false,
        profileCompleted: userData.profileCompleted || false
      };
      
      setProfileData(mappedData);
      
      // Set profile picture
      if (userData.avatar) {
        setProfilePicture(userData.avatar);
      }
      
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile data. Please try again.');
      
      // Fallback to localStorage if API fails
      loadUserDataFromStorage();
    } finally {
      setLoading(false);
    }
  };

  // Fallback method to load from localStorage
  const loadUserDataFromStorage = () => {
    const firstName = localStorage.getItem('userFirstName') || '';
    const lastName = localStorage.getItem('userLastName') || '';
    const fullName = localStorage.getItem('userName') || `${firstName} ${lastName}`.trim();
    
    const userData = {
      firstName,
      lastName,
      name: fullName,
      email: localStorage.getItem('userEmail') || 'user@example.com',
      phone: localStorage.getItem('userPhone') || '',
      joinDate: localStorage.getItem('userJoinDate') || new Date().toISOString(),
      role: localStorage.getItem('userRole') || currentRole
    };
    
    setProfileData(userData);
    
    const storedProfilePic = localStorage.getItem('userProfilePicture') || localStorage.getItem('userProfilePicUrl');
    if (storedProfilePic) {
      setProfilePicture(storedProfilePic);
    }
  };

  // Handle profile picture upload (UPDATED)
  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setSaving(true);
        setError('');
        
        // Update profile picture via API
        const response = await apiUpdateProfilePicture(file);
        
        // Update local state
        if (response.avatar) {
          setProfilePicture(response.avatar);
          
          // SYNC TO LOCALSTORAGE FOR HEADER CONSISTENCY
          localStorage.setItem('userProfilePicture', response.avatar);
          
          // DISPATCH CUSTOM EVENT TO UPDATE HEADER
          window.dispatchEvent(new CustomEvent('profileUpdated', {
            detail: { avatar: response.avatar }
          }));
          
          setSuccess('Profile picture updated successfully!');
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
        
      } catch (error) {
        console.error('Error updating profile picture:', error);
        setError('Failed to update profile picture. Please try again.');
        
        // Fallback to local file reading
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target.result;
          setProfilePicture(imageUrl);
          localStorage.setItem('userProfilePicture', imageUrl);
          
          // DISPATCH EVENT FOR HEADER UPDATE
          window.dispatchEvent(new CustomEvent('profileUpdated', {
            detail: { avatar: imageUrl }
          }));
        };
        reader.readAsDataURL(file);
      } finally {
        setSaving(false);
      }
    }
  };

  // Handle form field changes
  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle password field changes
  const handlePasswordInputChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear specific field error when user starts typing
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Validate password change form
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      errors.newPassword = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle password change submission
  const handlePasswordChangeSubmit = async () => {
    if (!validatePasswordForm()) {
      return;
    }
    
    try {
      setSaving(true);
      setError('');
      
      await apiChangePassword(passwordData.currentPassword, passwordData.newPassword);
      
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsChangingPassword(false);
      setSuccess('Password changed successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('Error changing password:', error);
      setError(error.message || 'Failed to change password. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Save profile changes (UPDATED)
  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      
      // Prepare update data matching your backend expectations
      const updateData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone
      };

      // Update profile via API
      const response = await apiUpdateProfile(updateData);
      
      // Update local state with response
      const updatedData = {
        ...profileData,
        firstName: response.firstName,
        lastName: response.lastName,
        phone: response.phone,
        name: `${response.firstName || ''} ${response.lastName || ''}`.trim()
      };
      
      setProfileData(updatedData);
      
      // SYNC TO LOCALSTORAGE FOR HEADER CONSISTENCY
      localStorage.setItem('userFirstName', response.firstName || '');
      localStorage.setItem('userLastName', response.lastName || '');
      localStorage.setItem('userName', updatedData.name);
      localStorage.setItem('userPhone', response.phone || '');
      
      // DISPATCH CUSTOM EVENT TO UPDATE HEADER
      window.dispatchEvent(new CustomEvent('profileUpdated', {
        detail: { 
          name: updatedData.name,
          firstName: response.firstName,
          lastName: response.lastName
        }
      }));
      
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
      
      // Fallback to localStorage
      saveToLocalStorage();
    } finally {
      setSaving(false);
    }
  };

  // Fallback save to localStorage (UPDATED)
  const saveToLocalStorage = () => {
    localStorage.setItem('userFirstName', profileData.firstName);
    localStorage.setItem('userLastName', profileData.lastName);
    localStorage.setItem('userName', profileData.name);
    localStorage.setItem('userPhone', profileData.phone);

    // DISPATCH EVENT FOR HEADER UPDATE
    window.dispatchEvent(new CustomEvent('profileUpdated', {
      detail: { 
        name: profileData.name,
        firstName: profileData.firstName,
        lastName: profileData.lastName
      }
    }));

    setIsEditing(false);
    setSuccess('Profile updated locally!');
    setTimeout(() => setSuccess(''), 3000);
  };

  // Get role display name and icon
  const getRoleInfo = (role) => {
    const roleInfo = {
      potchef: { name: 'Chef', icon: ChefHat, color: 'bg-gradient-to-r from-orange-500 to-red-500', bgColor: 'bg-orange-50', textColor: 'text-orange-700' },
      potlucky: { name: 'Food Lover', icon: Heart, color: 'bg-gradient-to-r from-pink-500 to-rose-500', bgColor: 'bg-pink-50', textColor: 'text-pink-700' },
      franchisee: { name: 'Franchisee', icon: Crown, color: 'bg-gradient-to-r from-purple-500 to-indigo-500', bgColor: 'bg-purple-50', textColor: 'text-purple-700' },
      admin: { name: 'Administrator', icon: Settings, color: 'bg-gradient-to-r from-gray-600 to-gray-800', bgColor: 'bg-gray-50', textColor: 'text-gray-700' }
    };
    return roleInfo[role] || { name: role, icon: User, color: 'bg-gradient-to-r from-gray-400 to-gray-600', bgColor: 'bg-gray-50', textColor: 'text-gray-700' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-4 max-w-sm w-full">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
            <Loader className="w-8 h-8 animate-spin text-white" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Loading Profile</h3>
            <p className="text-gray-600 text-sm">Please wait while we fetch your information...</p>
          </div>
        </div>
      </div>
    );
  }

  const roleInfo = getRoleInfo(profileData.role);
  const RoleIcon = roleInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 rounded-r-xl p-4 shadow-sm animate-slideIn">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 rounded-r-xl p-4 shadow-sm animate-slideIn">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-5 w-5 bg-green-400 rounded-full flex items-center justify-center">
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-green-700 font-medium">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Background */}
          <div className={`h-32 sm:h-40 ${roleInfo.color} relative`}>
            <div className="absolute inset-0 bg-green-200 bg-opacity-20"></div>
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
              {isEditing ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={saving}
                    className="p-2 sm:px-4 sm:py-2 bg-white bg-opacity-20 backdrop-blur-sm text-gray-900 border border-white border-opacity-30 rounded-xl hover:bg-opacity-30 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="p-2 sm:px-4 sm:py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-400 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 font-medium"
                  >
                    {saving ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">{saving ? 'Saving...' : 'Save'}</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 sm:px-4 sm:py-2 bg-white bg-opacity-20 backdrop-blur-sm text-orange-500 border border-white border-opacity-30 rounded-xl hover:bg-opacity-30 transition-all duration-200 flex items-center space-x-2 font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
            {/* Profile Picture and Basic Info */}
            <div className="relative -mt-16 sm:-mt-20 mb-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-white p-1 shadow-xl">
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt="Profile"
                        className="w-full h-full rounded-xl object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full rounded-xl ${roleInfo.color} flex items-center justify-center text-white text-2xl sm:text-3xl font-bold`}>
                        {profileData.firstName ? profileData.firstName.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute -bottom-2 -right-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-2 sm:p-3 rounded-xl cursor-pointer hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg">
                      {saving ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Camera className="w-4 h-4" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                        disabled={saving}
                      />
                    </label>
                  )}
                </div>
                
                {/* Name and Role */}
                <div className="flex-1 text-center sm:text-left space-y-3">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {profileData.name || 'Your Name'}
                    </h1>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className={`p-2 ${roleInfo.bgColor} rounded-xl`}>
                          <RoleIcon className={`w-5 h-5 ${roleInfo.textColor}`} />
                        </div>
                        <span className={`px-4 py-2 ${roleInfo.bgColor} ${roleInfo.textColor} rounded-xl text-sm font-semibold`}>
                          {roleInfo.name}
                        </span>
                      </div>
                      {profileData.role !== 'potlucky' && (
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          profileData.isApproved 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                        }`}>
                          {profileData.isApproved ? '✓ Approved' : '⏳ Pending Approval'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                  <User className="w-5 h-5 text-orange-500" />
                  <span>Personal Information</span>
                </h2>
                
                <div className="space-y-4">
                  {/* First Name */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.firstName || ''}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Enter your first name"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-gray-900 font-medium">{profileData.firstName || 'Not provided'}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Last Name */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.lastName || ''}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Enter your last name"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-gray-900 font-medium">{profileData.lastName || 'Not provided'}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Phone */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-900 font-medium">{profileData.phone || 'Not provided'}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-orange-500" />
                  <span>Account Information</span>
                </h2>
                
                <div className="space-y-4">
                  {/* Email */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-900 font-medium">{profileData.email}</p>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-md">Protected</span>
                    </div>
                  </div>
                  
                  {/* Member Since */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900 font-medium">
                        {new Date(profileData.joinDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {/* Account Status */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900 font-medium">Profile Completion</span>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          profileData.profileCompleted 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {profileData.profileCompleted ? 'Complete' : 'In Progress'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <Lock className="w-5 h-5 text-orange-500" />
                <span>Security Settings</span>
              </h2>
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center space-x-2 font-medium text-sm"
                >
                  <Key className="w-4 h-4" />
                  <span>Change Password</span>
                </button>
              )}
            </div>

            {isChangingPassword ? (
              <div className="space-y-4">
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
                  <h3 className="text-sm font-semibold text-orange-900 mb-2">Password Requirements</h3>
                  <ul className="text-orange-700 text-sm space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• Contains at least one uppercase letter (A-Z)</li>
                    <li>• Contains at least one lowercase letter (a-z)</li>
                    <li>• Contains at least one number (0-9)</li>
                  </ul>
                </div>

                {/* Current Password */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                      className={`w-full p-3 pr-12 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white ${
                        passwordErrors.currentPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your current password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
                  )}
                </div>

                {/* New Password */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                      className={`w-full p-3 pr-12 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white ${
                        passwordErrors.newPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
                  )}
                </div>

                {/* Confirm New Password */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                      className={`w-full p-3 pr-12 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white ${
                        passwordErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Confirm your new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                      setPasswordErrors({});
                      setShowPasswords({
                        current: false,
                        new: false,
                        confirm: false
                      });
                    }}
                    disabled={saving}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 font-medium"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handlePasswordChangeSubmit}
                    disabled={saving}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 font-medium"
                  >
                    {saving ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Key className="w-4 h-4" />
                    )}
                    <span>{saving ? 'Changing Password...' : 'Change Password'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">Password Protection</h3>
                        <p className="text-xs text-gray-600 mt-1">Your account is secured with a strong password</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Last changed</p>
                      <p className="text-sm font-medium text-gray-900">Never</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-blue-900 mb-1">Security Tip</h3>
                      <p className="text-blue-700 text-sm leading-relaxed">
                        For better security, consider changing your password regularly and use a unique password that you don't use elsewhere.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Information Note */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 mb-1">Profile Update Information</h3>
              <p className="text-blue-700 text-sm leading-relaxed">
                Currently, you can update your first name, last name, phone number, profile picture, and password. 
                Additional profile fields like bio, address, and role-specific information will be available in future updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;