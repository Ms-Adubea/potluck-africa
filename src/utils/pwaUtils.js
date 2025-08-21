// 📁 src/utils/pwaUtils.js - Updated PWA utils with notification integration
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
          
          // Listen for push events
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'PUSH_RECEIVED') {
              // Handle push notification received
              console.log('Push notification received:', event.data);
              
              // You can trigger a notification count refresh here
              const refreshEvent = new CustomEvent('refreshNotifications');
              window.dispatchEvent(refreshEvent);
            }
          });
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};

export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted');
      return true;
    } else {
      console.log('Notification permission denied');
      return false;
    }
  }
  return false;
};

// Updated subscribe function to work with your API
export const subscribeUserToPush = async () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY
      });
      
      // Use your API function instead of direct fetch
      const { apiSubscribeToNotifications } = await import('../services/notifications');
      await apiSubscribeToNotifications(subscription);
      
      return subscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  }
  return null;
};

export const showInstallPrompt = () => {
  let deferredPrompt;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show your custom install button
    const installButton = document.getElementById('install-button');
    if (installButton) {
      installButton.style.display = 'block';
      installButton.addEventListener('click', () => {
        installButton.style.display = 'none';
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
          deferredPrompt = null;
        });
      });
    }
  });
};

export const isStandalone = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
};

export const addToHomeScreen = () => {
  // iOS Safari doesn't support beforeinstallprompt
  if (isIOSSafari()) {
    showIOSInstallInstructions();
  }
};

const isIOSSafari = () => {
  const ua = window.navigator.userAgent;
  const iOS = !!ua.match(/iPad|iPhone|iPod/);
  const webkit = !!ua.match(/WebKit/);
  return iOS && webkit && !ua.match(/CriOS/);
};

const showIOSInstallInstructions = () => {
  // Show modal with instructions for iOS users
  alert('To install this app on your iOS device, tap the share button and then "Add to Home Screen"');
};
