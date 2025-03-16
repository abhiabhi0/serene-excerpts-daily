
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered successfully:', registration);
          
          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 1000 * 60 * 60); // Check for updates every hour
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
}

export function checkForAppUpdates(onUpdateFound: () => void) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.addEventListener('updatefound', () => {
        // An updated service worker has appeared in registration.installing!
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            // Has service worker state changed?
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available and will be used when all
              // tabs for this page are closed.
              console.log('New version available!');
              onUpdateFound();
            }
          });
        }
      });
    });
  }
}
