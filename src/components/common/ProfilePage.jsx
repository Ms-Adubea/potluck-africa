// 📁 src/components/common/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { Camera, Edit2, Save, X, MapPin, Phone, Mail, Calendar, Shield } from 'lucide-react';

const ProfilePage = ({ currentRole }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = () => {
      const userData = {
        name: localStorage.getItem('userName') || 'User Name',
        email: localStorage.getItem('userEmail') || 'user@example.com',
        phone: localStorage.getItem('userPhone') || '',
        address: localStorage.getItem('userAddress') || '',
        joinDate: localStorage.getItem('userJoinDate') || new Date().toISOString().split('T')[0],
        bio: localStorage.getItem('userBio') || '',
        // Role-specific fields
        ...getRoleSpecificFields(currentRole)
      };
      setProfileData(userData);
      
      const storedProfilePic = localStorage.getItem('userProfilePicture');
      if (storedProfilePic) {
        setProfilePicture(storedProfilePic);
      }
    };

    loadUserData();
  }, [currentRole]);

  // Get role-specific profile fields
  const getRoleSpecificFields = (role) => {
    const roleFields = {
      potchef: {
        specialty: localStorage.getItem('chefSpecialty') || '',
        experience: localStorage.getItem('chefExperience') || '',
        rating: localStorage.getItem('chefRating') || '0',
        totalMeals: localStorage.getItem('chefTotalMeals') || '0'
      },
      potlucky: {
        favoritesCuisine: localStorage.getItem('favoriteCuisine') || '',
        dietaryRestrictions: localStorage.getItem('dietaryRestrictions') || '',
        totalOrders: localStorage.getItem('totalOrders') || '0'
      },
      franchisee: {
        franchise: localStorage.getItem('franchiseName') || '',
        territory: localStorage.getItem('territory') || '',
        yearsActive: localStorage.getItem('yearsActive') || '0'
      },
      admin: {
        department: localStorage.getItem('adminDepartment') || '',
        permissions: localStorage.getItem('adminPermissions') || 'Standard'
      }
    };
    return roleFields[role] || {};
  };

  // Handle profile picture upload
  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setProfilePicture(imageUrl);
        localStorage.setItem('userProfilePicture', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form field changes
  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save profile changes
  const handleSave = () => {
    // Save basic info
    localStorage.setItem('userName', profileData.name);
    localStorage.setItem('userEmail', profileData.email);
    localStorage.setItem('userPhone', profileData.phone);
    localStorage.setItem('userAddress', profileData.address);
    localStorage.setItem('userBio', profileData.bio);

    // Save role-specific data
    const roleSpecificFields = getRoleSpecificFields(currentRole);
    Object.keys(roleSpecificFields).forEach(key => {
      if (profileData[key] !== undefined) {
        const storageKey = getStorageKey(key, currentRole);
        localStorage.setItem(storageKey, profileData[key]);
      }
    });

    setIsEditing(false);
    // You could add a success notification here
  };

  // Get storage key for role-specific fields
  const getStorageKey = (field, role) => {
    const keyMap = {
      potchef: {
        specialty: 'chefSpecialty',
        experience: 'chefExperience'
      },
      potlucky: {
        favoritesCuisine: 'favoriteCuisine',
        dietaryRestrictions: 'dietaryRestrictions'
      },
      franchisee: {
        franchise: 'franchiseName',
        territory: 'territory',
        yearsActive: 'yearsActive'
      },
      admin: {
        department: 'adminDepartment',
        permissions: 'adminPermissions'
      }
    };
    return keyMap[role]?.[field] || field;
  };

  // Get role display name
  const getRoleDisplayName = (role) => {
    const roleNames = {
      potchef: 'Chef',
      potlucky: 'Food Lover',
      franchisee: 'Franchisee',
      admin: 'Administrator'
    };
    return roleNames[role] || role;
  };

  // Get role-specific sections
  const getRoleSpecificSections = () => {
    switch (currentRole) {
      case 'potchef':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Chef Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                {isEditing ? (
                  <select
                    value={profileData.specialty || ''}
                    onChange={(e) => handleInputChange('specialty', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select Specialty</option>
                    <option value="Italian">Italian</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Indian">Indian</option>
                    <option value="Mexican">Mexican</option>
                    <option value="American">American</option>
                    <option value="French">French</option>
                    <option value="Thai">Thai</option>
                    <option value="Mediterranean">Mediterranean</option>
                  </select>
                ) : (
                  <p className="text-gray-600">{profileData.specialty || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={profileData.experience || ''}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    min="0"
                    max="50"
                  />
                ) : (
                  <p className="text-gray-600">{profileData.experience || '0'} years</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <p className="text-gray-600">⭐ {profileData.rating || '0'}/5</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Meals Created</label>
                <p className="text-gray-600">{profileData.totalMeals || '0'} meals</p>
              </div>
            </div>
          </div>
        );

      case 'potlucky':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Food Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Favorite Cuisine</label>
                {isEditing ? (
                  <select
                    value={profileData.favoritesCuisine || ''}
                    onChange={(e) => handleInputChange('favoritesCuisine', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select Cuisine</option>
                    <option value="Italian">Italian</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Indian">Indian</option>
                    <option value="Mexican">Mexican</option>
                    <option value="American">American</option>
                    <option value="French">French</option>
                    <option value="Thai">Thai</option>
                    <option value="Mediterranean">Mediterranean</option>
                  </select>
                ) : (
                  <p className="text-gray-600">{profileData.favoritesCuisine || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Orders</label>
                <p className="text-gray-600">{profileData.totalOrders || '0'} orders</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Restrictions</label>
              {isEditing ? (
                <textarea
                  value={profileData.dietaryRestrictions || ''}
                  onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows="2"
                  placeholder="e.g., Vegetarian, Nut allergy, Gluten-free"
                />
              ) : (
                <p className="text-gray-600">{profileData.dietaryRestrictions || 'None specified'}</p>
              )}
            </div>
          </div>
        );

      case 'franchisee':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Franchise Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Franchise Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.franchise || ''}
                    onChange={(e) => handleInputChange('franchise', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-600">{profileData.franchise || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Territory</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.territory || ''}
                    onChange={(e) => handleInputChange('territory', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-600">{profileData.territory || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years Active</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={profileData.yearsActive || ''}
                    onChange={(e) => handleInputChange('yearsActive', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    min="0"
                  />
                ) : (
                  <p className="text-gray-600">{profileData.yearsActive || '0'} years</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'admin':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Administrative Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                {isEditing ? (
                  <select
                    value={profileData.department || ''}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select Department</option>
                    <option value="Operations">Operations</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Technology">Technology</option>
                    <option value="Customer Service">Customer Service</option>
                  </select>
                ) : (
                  <p className="text-gray-600">{profileData.department || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Permission Level</label>
                <p className="text-gray-600">{profileData.permissions || 'Standard'}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center space-x-2"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Profile Picture & Basic Info */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-start space-x-6">
          <div className="relative">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center text-white text-2xl font-medium">
                {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full cursor-pointer hover:bg-orange-600">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-orange-500" />
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                  {getRoleDisplayName(currentRole)}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profileData.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profileData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-600">{profileData.email}</p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-600">{profileData.phone || 'Not provided'}</p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-600">
                    {new Date(profileData.joinDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              {isEditing ? (
                <textarea
                  value={profileData.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows="2"
                />
              ) : (
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <p className="text-gray-600">{profileData.address || 'Not provided'}</p>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              {isEditing ? (
                <textarea
                  value={profileData.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows="3"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-600">{profileData.bio || 'No bio provided'}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Role-specific sections */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {getRoleSpecificSections()}
      </div>
    </div>
  );
};

export default ProfilePage;
