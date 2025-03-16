// Service worker for handling notifications
self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    return self.clients.claim();
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
  
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        // If a window client is available, focus it
        for (const client of clientList) {
          if (client.url && 'focus' in client) {
            return client.focus();
          }
        }
      
        // Otherwise, open a new window
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
});

// Listen for push messages
self.addEventListener('push', event => {
    const data = event.data.json();
  
    const options = {
      body: data.body || 'Time for your morning ritual with Atmanam Viddhi. Start your day mindfully.',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      data: {
        url: data.url || '/'
      }
    };

    event.waitUntil(
      self.registration.showNotification('Morning Ritual', options)
    );
});