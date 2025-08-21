// 📁 src/components/common/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Moon, 
  Globe, 
  Shield, 
  Smartphone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Save,
  AlertTriangle
} from 'lucide-react';
import NotificationSettings from './NotificationSettings';

const SettingsPage = ({ currentRole }) => {
  const [settings, setSettings] = useState({
    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    promotionalEmails: false,
    
    // Privacy settings
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    dataSharing: false,
    
    // App preferences
    darkMode: false,
    language: 'en',
    currency: 'USD',
    
    // Security
    twoFactorAuth: false,
    loginAlerts: true,
    
    // Role-specific settings
    ...getRoleSpecificDefaults(currentRole)
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  }, []);

  // Get default settings for each role
  function getRoleSpecificDefaults(role) {
    const roleDefaults = {
      potchef: {
        orderNotifications: true,
        mealApprovalAlerts: true,
        customerReviews: true,
        autoAcceptOrders: false
      },
      potlucky: {
        mealRecommendations: true,
        favoriteChefUpdates: true,
        orderStatusSMS: true,
        locationTracking: true
      },
      franchisee: {
        chefApplications: true,
        performanceReports: true,
        systemAlerts: true,
        weeklyDigest: true
      },
      admin: {
        systemNotifications: true,
        securityAlerts: true,
        userReports: true,
        dataExports: false
      }
    };
    return roleDefaults[role] || {};
  }

  // Handle setting changes
  const handleSettingChange = (key, value) => {
    setSettings(prev => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem('userSettings', JSON.stringify(updated));
      return updated;
    });
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    
    // Here you would typically make an API call to change the password
    console.log('Password change requested');
    alert('Password updated successfully');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Get role-specific settings sections
  const getRoleSpecificSettings = () => {
    switch (currentRole) {
      case 'potchef':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Chef Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Order Notifications</p>
                  <p className="text-sm text-gray-500">Get notified when you receive new orders</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.orderNotifications}
                  onChange={(e) => handleSettingChange('orderNotifications', e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Order Status SMS</p>
                  <p className="text-sm text-gray-500">Receive SMS updates about your order status</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.orderStatusSMS}
                  onChange={(e) => handleSettingChange('orderStatusSMS', e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Location Tracking</p>
                  <p className="text-sm text-gray-500">Allow location access for nearby chef recommendations</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.locationTracking}
                  onChange={(e) => handleSettingChange('locationTracking', e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
        );

      case 'franchisee':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Franchisee Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Chef Applications</p>
                  <p className="text-sm text-gray-500">Notifications for new chef applications in your area</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.chefApplications}
                  onChange={(e) => handleSettingChange('chefApplications', e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Performance Reports</p>
                  <p className="text-sm text-gray-500">Weekly and monthly performance summaries</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.performanceReports}
                  onChange={(e) => handleSettingChange('performanceReports', e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">System Alerts</p>
                  <p className="text-sm text-gray-500">Important system updates and maintenance notifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.systemAlerts}
                  onChange={(e) => handleSettingChange('systemAlerts', e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Weekly Digest</p>
                  <p className="text-sm text-gray-500">Summary of franchise activities and metrics</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.weeklyDigest}
                  onChange={(e) => handleSettingChange('weeklyDigest', e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
        );

      case 'admin':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Administrator Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">System Notifications</p>
                  <p className="text-sm text-gray-500">Critical system alerts and updates</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.systemNotifications}
                  onChange={(e) => handleSettingChange('systemNotifications', e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Security Alerts</p>
                  <p className="text-sm text-gray-500">Security incidents and login anomalies</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.securityAlerts}
                  onChange={(e) => handleSettingChange('securityAlerts', e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">User Reports</p>
                  <p className="text-sm text-gray-500">User-generated reports and complaints</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.userReports}
                  onChange={(e) => handleSettingChange('userReports', e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Data Exports</p>
                  <p className="text-sm text-gray-500">Automated data export notifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.dataExports}
                  onChange={(e) => handleSettingChange('dataExports', e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Customize your app experience and preferences</p>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <NotificationSettings />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
              className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">Push Notifications</p>
              <p className="text-sm text-gray-500">Browser/device push notifications</p>
            </div>
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
              className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">SMS Notifications</p>
              <p className="text-sm text-gray-500">Text message notifications</p>
            </div>
            <input
              type="checkbox"
              checked={settings.smsNotifications}
              onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
              className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">Order Updates</p>
              <p className="text-sm text-gray-500">Updates about order status changes</p>
            </div>
            <input
              type="checkbox"
              checked={settings.orderUpdates}
              onChange={(e) => handleSettingChange('orderUpdates', e.target.checked)}
              className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">Promotional Emails</p>
              <p className="text-sm text-gray-500">Marketing and promotional content</p>
            </div>
            <input
              type="checkbox"
              checked={settings.promotionalEmails}
              onChange={(e) => handleSettingChange('promotionalEmails', e.target.checked)}
              className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-800">Privacy</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">Profile Visibility</p>
              <p className="text-sm text-gray-500">Who can see your profile information</p>
            </div>
            <select
              value={settings.profileVisibility}
              onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">Show Email Address</p>
              <p className="text-sm text-gray-500">Make your email visible to other users</p>
            </div>
            <input
              type="checkbox"
              checked={settings.showEmail}
              onChange={(e) => handleSettingChange('showEmail', e.target.checked)}
              className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">Show Phone Number</p>
              <p className="text-sm text-gray-500">Make your phone number visible to other users</p>
            </div>
            <input
              type="checkbox"
              checked={settings.showPhone}
              onChange={(e) => handleSettingChange('showPhone', e.target.checked)}
              className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">Data Sharing</p>
              <p className="text-sm text-gray-500">Allow anonymous data sharing for app improvement</p>
            </div>
            <input
              type="checkbox"
              checked={settings.dataSharing}
              onChange={(e) => handleSettingChange('dataSharing', e.target.checked)}
              className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      {/* App Preferences */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Smartphone className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-800">App Preferences</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">Dark Mode</p>
              <p className="text-sm text-gray-500">Use dark theme throughout the app</p>
            </div>
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
              className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">Language</p>
              <p className="text-sm text-gray-500">Choose your preferred language</p>
            </div>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">Currency</p>
              <p className="text-sm text-gray-500">Default currency for pricing</p>
            </div>
            <select
              value={settings.currency}
              onChange={(e) => handleSettingChange('currency', e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD (C$)</option>
              <option value="AUD">AUD (A$)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Lock className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-800">Security</h3>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <input
              type="checkbox"
              checked={settings.twoFactorAuth}
              onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
              className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">Login Alerts</p>
              <p className="text-sm text-gray-500">Get notified of new device logins</p>
            </div>
            <input
              type="checkbox"
              checked={settings.loginAlerts}
              onChange={(e) => handleSettingChange('loginAlerts', e.target.checked)}
              className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
            />
          </div>
          
          {/* Change Password */}
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-700 mb-4">Change Password</h4>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full p-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full p-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                    minLength="8"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full p-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                    minLength="8"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Update Password</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Role-specific settings */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {getRoleSpecificSettings()}
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-red-800">Danger Zone</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <p className="font-medium text-red-800">Delete Account</p>
              <p className="text-sm text-red-600">Permanently delete your account and all associated data</p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  // Handle account deletion
                  console.log('Account deletion requested');
                  alert('Account deletion request submitted. You will receive a confirmation email.');
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;