// 📁 src/components/common/Header.jsx - Updated with proper logout integration

import React, { useState, useEffect } from "react";
import {
  Bell,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import navigationConfig from "../../constants/navigationConfig";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthToken } from "../../services/config";
import { clearUserData } from "../../services/auth";

// Header Component with Profile Dropdown
const Header = ({ currentRole }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();
  const config = navigationConfig[currentRole];
  
  // Get user info from localStorage
  const userName = localStorage.getItem('userName') || 'User';
  const userEmail = localStorage.getItem('userEmail') || '';
  
  // Load profile picture on component mount
  useEffect(() => {
    const loadProfilePicture = () => {
      // Try to get profile picture from localStorage first
      const storedProfilePic = localStorage.getItem('userProfilePicture');
      if (storedProfilePic) {
        setProfilePicture(storedProfilePic);
      } else {
        // If no stored profile picture, try to get from API or other source
        const profilePicUrl = localStorage.getItem('userProfilePicUrl');
        if (profilePicUrl) {
          setProfilePicture(profilePicUrl);
        }
      }
    };

    loadProfilePicture();
  }, []);

  // Get first name from full name
  const getFirstName = (fullName) => {
    if (!fullName) return 'User';
    return fullName.split(' ')[0];
  };

  // Get first letter for avatar
  const getInitial = (fullName) => {
    if (!fullName) return 'U';
    const firstName = fullName.split(' ')[0];
    return firstName.charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    // Clear all auth data using the centralized function
    clearAuthToken();
    clearUserData();
    
    // Redirect to login
    navigate('/login', { replace: true });
  };

  // Profile Avatar Component
  const ProfileAvatar = () => {
    if (profilePicture) {
      return (
        <img
          src={profilePicture}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
          onError={() => {
            // If image fails to load, remove it from state and localStorage
            setProfilePicture(null);
            localStorage.removeItem('userProfilePicture');
            localStorage.removeItem('userProfilePicUrl');
          }}
        />
      );
    }
    
    // Fallback to initial
    return (
      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-medium">
        {getInitial(userName)}
      </div>
    );
  };

  return (
    <header className="bg-white shadow-sm border-b p-4 flex justify-between items-center relative">
      <div className="flex items-center space-x-2">
        <span>{config.avatar}</span>
        <Link to="/">
          <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text font-semibold text-xl text-transparent">
            Potluck
          </span>
        </Link>
      </div>

      <div className="flex space-x-4 items-center">
        <Bell className="w-5 h-5 text-gray-500" />
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
        >
          <ProfileAvatar />
          <span className="text-sm font-medium text-gray-700">
            {getFirstName(userName)}
          </span>
        </button>

        {/* Profile Dropdown */}
        {isProfileOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsProfileOpen(false)}
            />
            <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border z-20">
              <div className="p-4 border-b">
                <div className="flex items-center space-x-3 mb-2">
                  {/* Larger profile picture in dropdown */}
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover"
                      onError={() => {
                        setProfilePicture(null);
                        localStorage.removeItem('userProfilePicture');
                        localStorage.removeItem('userProfilePicUrl');
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-medium text-lg">
                      {getInitial(userName)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{userName}</p>
                    <p className="text-sm text-gray-600 truncate">{userEmail}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 capitalize">
                  {currentRole}
                </p>
              </div>
              <div className="py-2">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    // Handle profile navigation - you can implement this
                    console.log('Navigate to profile');
                  }}
                  className="w-full flex items-center px-4 py-2 text-left hover:bg-gray-50"
                >
                  <User className="w-4 h-4 mr-3" />
                  Profile
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    // Handle settings navigation - you can implement this
                    console.log('Navigate to settings');
                  }}
                  className="w-full flex items-center px-4 py-2 text-left hover:bg-gray-50"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </button>
                <div className="border-t my-2"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-left hover:bg-gray-50 text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;