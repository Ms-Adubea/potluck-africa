import React, { useState } from 'react';
import { ChefHat, Loader2, Eye, EyeOff, Mail, Lock, User, UserCircle, Camera, X, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRegister, storeUserData } from '../../services/auth';
import { storeCompressedProfilePicture } from '../../utils/profilePictureUtils';


const AddUsers = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '',
    avatar: null
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const navigate = useNavigate();


  const roles = [
    { value: 'potchef', label: '🍳 Chef/Potchef', description: 'Cook and share your homemade meals' },
    { value: 'potlucky', label: '🍽️ Customer/Potlucky', description: 'Discover and order amazing home-cooked meals' },
    { value: 'franchisee', label: '🏢 Manager/Franchisee', description: 'Manage and approve local operations' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async () => {
  if (!validateForm()) return;

  setIsLoading(true);

  try {
    const formPayload = new FormData();
    formPayload.append('firstName', formData.firstName);
    formPayload.append('lastName', formData.lastName);
    formPayload.append('email', formData.email);
    formPayload.append('phone', formData.phone);
    formPayload.append('password', formData.password);
    formPayload.append('role', formData.role);
    
    if (formData.avatar) {
      formPayload.append('avatar', formData.avatar);
    }

    // Call the real backend API
    const response = await apiRegister(formPayload);
    
     // Store user data including profile picture
    const userData = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      role: formData.role,
      // Include profile picture URL from server response if available
      profilePicture: response.profilePicture || response.profilePictureUrl || response.avatar
    };
    
    // Store profile picture locally for PWA
    if (formData.avatar) {
      await storeCompressedProfilePicture(formData.avatar);
    }
    
    // If the backend returns a profile picture URL, store that too
    if (response.data?.profilePictureUrl) {
      localStorage.setItem('userProfilePicUrl', response.data.profilePictureUrl);
    }

    await storeUserData(userData, formData.avatar);
    alert('Account created successfully! Welcome to Potluck!');
    navigate('/login');
  } catch (error) {
    console.error('Registration error:', error);
    alert(error.response?.data?.message || 'Registration failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};


  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      setFormData(prev => ({ ...prev, avatar: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setFormData(prev => ({ ...prev, avatar: null }));
    setAvatarPreview(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-red-50 to-orange-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100">
        {/* Header */}
        <div className="text-center pt-8 pb-6 px-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
              <ChefHat className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Potluck</h1>
          <p className="text-gray-600">Create your account and start your food journey</p>
        </div>

        {/* Form */}
        <div className="px-8 pb-8">
          <div className="space-y-5">
            {/* Avatar Upload */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-100 to-red-100 border-4 border-white shadow-lg overflow-hidden">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Avatar preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserCircle className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Upload Button */}
                <label htmlFor="avatar" className="absolute -bottom-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white p-2 rounded-full shadow-lg cursor-pointer hover:from-orange-600 hover:to-red-600 transition-all duration-200">
                  <Camera className="w-4 h-4" />
                  <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
                
                {/* Remove Button */}
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            <div className="text-center mb-6">
              <p className="text-sm text-gray-500">
                {avatarPreview ? 'Looking good!' : 'Add a profile picture (optional)'}
              </p>
            </div>

            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 bg-orange-50 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 bg-orange-50 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-orange-50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="phone"
                  type="tel"
                  placeholder="0554093367"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-orange-50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                I want to be a...
              </label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-orange-50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors appearance-none ${
                    errors.role ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select your role</option>
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
              {formData.role && (
                <p className="mt-1 text-sm text-gray-500">
                  {roles.find(r => r.value === formData.role)?.description}
                </p>
              )}
              {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg bg-orange-50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg bg-orange-50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login">
              <button className="text-orange-500 hover:text-orange-600 font-medium hover:underline transition-colors">
                Sign in
              </button>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUsers;
