// // public/sw.js - Service Worker
// const CACHE_NAME = 'potlucky-v1';
// const urlsToCache = [
//   '/',
//   '/static/js/bundle.js',
//   '/static/css/main.css',
//   '/manifest.json',
//   '/icon-192x192.png',
//   '/icon-512x512.png'
// ];

// // Install event
// self.addEventListener('install', (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then((cache) => cache.addAll(urlsToCache))
//   );
// });

// // Fetch event
// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request)
//       .then((response) => {
//         // Return cached version or fetch from network
//         if (response) {
//           return response;
//         }
//         return fetch(event.request);
//       }
//     )
//   );
// });

// // Activate event
// self.addEventListener('activate', (event) => {
//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames.map((cacheName) => {
//           if (cacheName !== CACHE_NAME) {
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });

// // Background sync for offline orders
// self.addEventListener('sync', (event) => {
//   if (event.tag === 'background-sync-orders') {
//     event.waitUntil(syncOrders());
//   }
// });

// async function syncOrders() {
//   try {
//     const orders = JSON.parse(localStorage.getItem('pendingOrders') || '[]');
    
//     for (const order of orders) {
//       try {
//         const response = await fetch('/api/orders', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(order),
//         });
        
//         if (response.ok) {
//           // Remove synced order from pending orders
//           const updatedOrders = orders.filter(o => o.id !== order.id);
//           localStorage.setItem('pendingOrders', JSON.stringify(updatedOrders));
//         }
//       } catch (error) {
//         console.error('Failed to sync order:', error);
//       }
//     }
//   } catch (error) {
//     console.error('Background sync failed:', error);
//   }
// }

// // Push notifications
// self.addEventListener('push', (event) => {
//   const options = {
//     body: event.data ? event.data.text() : 'Your order update is ready!',
//     icon: '/icon-192x192.png',
//     badge: '/icon-72x72.png',
//     vibrate: [100, 50, 100],
//     data: {
//       dateOfArrival: Date.now(),
//       primaryKey: '1'
//     },
//     actions: [
//       {
//         action: 'explore',
//         title: 'View Order',
//         icon: '/images/checkmark.png'
//       },
//       {
//         action: 'close',
//         title: 'Close',
//         icon: '/images/xmark.png'
//       }
//     ]
//   };
  
//   event.waitUntil(
//     self.registration.showNotification('Potlucky', options)
//   );
// });

// // Handle notification clicks
// self.addEventListener('notificationclick', (event) => {
//   event.notification.close();
  
//   if (event.action === 'explore') {
//     event.waitUntil(
//       clients.openWindow('/dashboard/orders')
//     );
//   }
// });


// 📁 public/sw.js - Service Worker for Push Notifications
const CACHE_NAME = 'potlucky-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Cache installed');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Push event - handle push notifications
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
  
  let notificationData = {
    title: 'New Notification',
    body: 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: 'general',
    data: {
      url: '/'
    }
  };

  // Parse the push payload if it exists
  if (event.data) {
    try {
      const payload = event.data.json();
      notificationData = {
        title: payload.title || notificationData.title,
        body: payload.body || notificationData.body,
        icon: payload.icon || notificationData.icon,
        badge: payload.badge || notificationData.badge,
        tag: payload.tag || payload.type || notificationData.tag,
        data: {
          url: payload.url || notificationData.data.url,
          notificationId: payload.id,
          type: payload.type
        },
        requireInteraction: payload.requireInteraction || false,
        actions: payload.actions || []
      };
    } catch (error) {
      console.error('Error parsing push payload:', error);
    }
  }

  const promiseChain = self.registration.showNotification(
    notificationData.title,
    {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      data: notificationData.data,
      requireInteraction: notificationData.requireInteraction,
      actions: notificationData.actions,
      vibrate: [200, 100, 200], // Vibration pattern
      timestamp: Date.now()
    }
  );

  event.waitUntil(promiseChain);
  
  // Notify all clients that a push was received
  event.waitUntil(
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'PUSH_RECEIVED',
          notification: notificationData
        });
      });
    })
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  const clickAction = event.action;
  const notificationData = event.notification.data;
  
  let urlToOpen = '/';
  
  // Handle different click actions
  if (clickAction === 'view') {
    urlToOpen = notificationData.url || '/';
  } else if (clickAction === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action (clicking the notification body)
    urlToOpen = notificationData.url || '/';
  }
  
  // Focus existing window or open new one
  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then((windowClients) => {
    let matchingClient = null;
    
    // Check if there's already a window open
    for (let i = 0; i < windowClients.length; i++) {
      const windowClient = windowClients[i];
      if (windowClient.url.includes(self.location.origin)) {
        matchingClient = windowClient;
        break;
      }
    }
    
    if (matchingClient) {
      // Focus existing window and navigate
      return matchingClient.focus().then(() => {
        if (urlToOpen !== '/') {
          return matchingClient.navigate(urlToOpen);
        }
        return matchingClient;
      });
    } else {
      // Open new window
      return clients.openWindow(urlToOpen);
    }
  }).then((client) => {
    // Mark notification as read if we have the ID
    if (notificationData.notificationId && client) {
      client.postMessage({
        type: 'MARK_NOTIFICATION_READ',
        notificationId: notificationData.notificationId
      });
    }
  });
  
  event.waitUntil(promiseChain);
});

// Background sync event (for offline functionality)
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-notifications') {
    event.waitUntil(syncNotifications());
  }
});

// Function to sync notifications when back online
async function syncNotifications() {
  try {
    // Get pending notification actions from IndexedDB or localStorage
    const pendingActions = await getPendingNotificationActions();
    
    for (const action of pendingActions) {
      try {
        // Perform the action (mark as read, delete, etc.)
        await performNotificationAction(action);
      } catch (error) {
        console.error('Failed to sync notification action:', error);
      }
    }
    
    // Clear pending actions after successful sync
    await clearPendingNotificationActions();
  } catch (error) {
    console.error('Failed to sync notifications:', error);
  }
}

// Helper functions for offline notification management
async function getPendingNotificationActions() {
  // This would typically use IndexedDB for more robust offline storage
  // For now, we'll use a simple approach
  return [];
}

async function performNotificationAction(action) {
  // Perform the actual API call
  const response = await fetch(action.url, {
    method: action.method,
    headers: action.headers,
    body: action.body
  });
  
  if (!response.ok) {
    throw new Error(`Action failed: ${response.status}`);
  }
}

async function clearPendingNotificationActions() {
  // Clear the pending actions storage
}
