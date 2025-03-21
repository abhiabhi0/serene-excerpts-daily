// Cache version - update this when content changes
const CACHE_NAME = 'site-cache-v1';
const USER_DATA_CACHE = 'user-data-cache';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/manifest.json'
];

// Service worker installation
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('Service Worker installed, skipping wait');
        return self.skipWaiting();  // Force activation
      })
  );
});

// Service worker activation and cache cleanup
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  const currentCaches = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => {
      console.log('Service Worker activated, claiming clients');
      return self.clients.claim();  // Take control of all clients
    })
  );
});

// Fetch handler with network-first strategy for API calls, cache-first for static assets
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Handle API requests differently
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
    return;
  }

  // For static assets, try cache first
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
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

// Handle notification clicks
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

// Message event for cache clearing
self.addEventListener('message', (event) => {
  if (event.data.type === 'CLEAR_SITE_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Only clear the site cache, preserve user data cache
            if (cacheName === CACHE_NAME) {
              return caches.delete(cacheName).then(() => {
                return caches.open(CACHE_NAME);
              });
            }
          })
        );
      })
    );
  }
});
