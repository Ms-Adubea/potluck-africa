// 📁 src/components/admin/NotificationManager.jsx - Admin notification management component
import React, { useState } from 'react';
import { 
  Send, 
  Users, 
  MessageSquare, 
  Bell, 
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';
import { apiSendNotification, apiBroadcastNotification } from '../../services/notifications';

const NotificationManager = () => {
  const [activeTab, setActiveTab] = useState('individual');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Individual notification state
  const [individualNotification, setIndividualNotification] = useState({
    title: '',
    body: '',
    icon: '/logo-192.png',
    url: 'https://potluck.africa/orders'
  });

  // Broadcast notification state
  const [broadcastNotification, setBroadcastNotification] = useState({
    title: '',
    body: '',
    url: 'https://potluck.app/dashboard'
  });

  // Handle individual notification send
  const handleSendIndividualNotification = async (e) => {
    e.preventDefault();
    
    if (!individualNotification.title || !individualNotification.body) {
      setErrorMessage('Please fill in both title and body');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await apiSendNotification(individualNotification);
      setSuccessMessage('Individual notification sent successfully!');
      
      // Reset form
      setIndividualNotification({
        title: '',
        body: '',
        icon: '/logo-192.png',
        url: 'https://potluck.africa/orders'
      });
    } catch (error) {
      console.error('Error sending individual notification:', error);
      setErrorMessage('Failed to send notification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle broadcast notification send
  const handleSendBroadcastNotification = async (e) => {
    e.preventDefault();
    
    if (!broadcastNotification.title || !broadcastNotification.body) {
      setErrorMessage('Please fill in both title and body');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await apiBroadcastNotification(broadcastNotification);
      setSuccessMessage('Broadcast notification sent to all subscribers!');
      
      // Reset form
      setBroadcastNotification({
        title: '',
        body: '',
        url: 'https://potluck.app/dashboard'
      });
    } catch (error) {
      console.error('Error sending broadcast notification:', error);
      setErrorMessage('Failed to send broadcast. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Quick notification templates
  const quickTemplates = {
    orderUpdate: {
      title: 'Order Update',
      body: 'Your meal is now READY 🍲',
      url: 'https://potluck.africa/orders'
    },
    promotion: {
      title: '🎉 Special Offer!',
      body: 'Get 20% off your next order with code POTLUCK20',
      url: 'https://potluck.africa'
    },
    systemUpdate: {
      title: '⚙️ System Maintenance',
      body: 'Scheduled maintenance tonight from 2-4 AM',
      url: 'https://potluck.app/dashboard'
    }
  };

  const applyTemplate = (template, type) => {
    if (type === 'individual') {
      setIndividualNotification(prev => ({
        ...prev,
        ...template
      }));
    } else {
      setBroadcastNotification(prev => ({
        ...prev,
        ...template
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Bell className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Notification Manager</h2>
            <p className="text-gray-600">Send targeted or broadcast notifications to users</p>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800">{errorMessage}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('individual')}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === 'individual'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Individual Notification</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('broadcast')}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === 'broadcast'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Broadcast to All</span>
            </div>
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'individual' ? (
            <form onSubmit={handleSendIndividualNotification} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={individualNotification.title}
                    onChange={(e) => setIndividualNotification(prev => ({
                      ...prev,
                      title: e.target.value
                    }))}
                    placeholder="e.g., Order Update"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon URL
                  </label>
                  <input
                    type="text"
                    value={individualNotification.icon}
                    onChange={(e) => setIndividualNotification(prev => ({
                      ...prev,
                      icon: e.target.value
                    }))}
                    placeholder="/logo-192.png"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={individualNotification.body}
                  onChange={(e) => setIndividualNotification(prev => ({
                    ...prev,
                    body: e.target.value
                  }))}
                  placeholder="Your meal is now READY 🍲"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action URL
                </label>
                <input
                  type="url"
                  value={individualNotification.url}
                  onChange={(e) => setIndividualNotification(prev => ({
                    ...prev,
                    url: e.target.value
                  }))}
                  placeholder="https://potluck.africa/orders"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Quick Templates */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Quick Templates
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(quickTemplates).map(([key, template]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => applyTemplate(template, 'individual')}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {template.title}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                <span>{loading ? 'Sending...' : 'Send Individual Notification'}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleSendBroadcastNotification} className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    This will send notifications to ALL subscribers
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={broadcastNotification.title}
                  onChange={(e) => setBroadcastNotification(prev => ({
                    ...prev,
                    title: e.target.value
                  }))}
                  placeholder="e.g., Admin Message 🚨"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={broadcastNotification.body}
                  onChange={(e) => setBroadcastNotification(prev => ({
                    ...prev,
                    body: e.target.value
                  }))}
                  placeholder="This is a broadcast to all subscribers"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action URL
                </label>
                <input
                  type="url"
                  value={broadcastNotification.url}
                  onChange={(e) => setBroadcastNotification(prev => ({
                    ...prev,
                    url: e.target.value
                  }))}
                  placeholder="https://potluck.app/dashboard"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Quick Templates */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Quick Templates
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(quickTemplates).map(([key, template]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => applyTemplate(template, 'broadcast')}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {template.title}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Users className="w-5 h-5" />
                )}
                <span>{loading ? 'Broadcasting...' : 'Broadcast to All Users'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationManager;
