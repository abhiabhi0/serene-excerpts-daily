// Cache version - update this when content changes
const CACHE_NAME = 'atmanam-viddhi-v2';

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
  
  // Keep user data caches when updating
  const cacheKeepList = [CACHE_NAME, 'user-data-cache'];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !cacheKeepList.includes(cacheName));
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
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip Supabase API requests to avoid caching authentication data
  if (event.request.url.includes('supabase.co')) {
    return fetch(event.request);
  }

  // For localStorage-related URLs, use network-only to ensure fresh data
  if (event.request.url.includes('localStorage') || 
      event.request.url.includes('localExcerpts') ||
      event.request.url.includes('morningRitual')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Return cached response immediately
        return cachedResponse;
      }

      // For non-cached responses, fetch from network
      return fetch(event.request)
        .then(response => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response as it's a stream and can only be consumed once
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        })
        .catch(() => {
          // When network fails, return a fallback if available
          if (event.request.url.indexOf('.html') > -1) {
            return caches.match('/');
          }
        });
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
