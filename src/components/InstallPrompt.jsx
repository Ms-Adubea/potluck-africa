// components/InstallPrompt.js - Install prompt component
import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Don't show immediately, wait for user interaction
      setTimeout(() => {
        if (!localStorage.getItem('installPromptDismissed')) {
          setShowPrompt(true);
        }
      }, 5000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('installPromptDismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Download className="w-5 h-5 text-orange-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">Install Potlucky</h3>
          <p className="text-sm text-gray-600 mt-1">
            Install our app for a better experience with offline access and notifications
          </p>
          <div className="flex space-x-2 mt-3">
            <button
              onClick={handleInstall}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;
