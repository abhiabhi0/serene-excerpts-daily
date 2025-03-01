// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Initialize Firebase with your config
// NOTE: Since this file is public, only include necessary items and use your real values
firebase.initializeApp({
  apiKey: "AIzaSyCvqgT9__8j0QwulSVUyJhvU0wpdhtLOSM",
  authDomain: "atmanam-viddhi.firebaseapp.com",
  projectId: "atmanam-viddhi",
  storageBucket: "atmanam-viddhi.firebasestorage.app",
  messagingSenderId: "349784402999",
  appId: "1:349784402999:web:54e3733c4e5ed4186ca3b2"
});

// Get messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);
  
  // Extract notification details
  const notificationTitle = payload.notification.title || 'Daily Wisdom';
  const notificationOptions = {
    body: payload.notification.body || 'New wisdom available',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data,
    // Add other notification options as needed
  };
  
  // Show notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // This assumes the data has a 'url' field to navigate to when clicked
  const urlToOpen = event.notification.data?.url || '/';
  
  // Open or focus the client
  event.waitUntil(
    clients.matchAll({type: 'window'}).then(windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no open window/tab, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
