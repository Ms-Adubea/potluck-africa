import React, { useState } from 'react';
import { Send, Users, AlertTriangle, Check } from 'lucide-react';
import { apiBroadcastNotification } from '../../services/notifications';

const BroadcastPanel = () => {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    url: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.body.trim()) {
      setError('Title and message are required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await apiBroadcastNotification({
        title: formData.title.trim(),
        body: formData.body.trim(),
        url: formData.url.trim() || undefined
      });
      
      setFormData({ title: '', body: '', url: '' });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to send broadcast');
    }

    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Users className="h-6 w-6 text-orange-600" />
        <h2 className="text-lg font-semibold text-gray-900">Broadcast Notification</h2>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800 mb-1">
              Send to All Users
            </h3>
            <p className="text-sm text-yellow-700">
              This will send a push notification to all subscribed users. Use this feature responsibly.
            </p>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">
              Broadcast sent successfully!
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Notification Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., System Maintenance Notice"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            maxLength={50}
          />
          <p className="text-xs text-gray-500 mt-1">{formData.title.length}/50 characters</p>
        </div>

        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
            Message *
          </label>
          <textarea
            id="body"
            value={formData.body}
            onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
            placeholder="Enter your broadcast message here..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            maxLength={200}
          />
          <p className="text-xs text-gray-500 mt-1">{formData.body.length}/200 characters</p>
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            Action URL (optional)
          </label>
          <input
            type="url"
            id="url"
            value={formData.url}
            onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
            placeholder="https://potluck.africa/dashboard"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Users will be redirected here when they click the notification</p>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading || !formData.title.trim() || !formData.body.trim()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Broadcast
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BroadcastPanel;
