
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Register the service worker from the root path to ensure it can control all pages
      navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
        .then(registration => {
          console.log('Service Worker registered successfully:', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available; notify user if needed
                  console.log('New content is available; please refresh.');
                  
                  // Don't automatically update to preserve user data
                  if (confirm('New version available! Would you like to update? (Your saved data will be preserved)')) {
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
}

export function requestNotificationPermission() {
  if ('Notification' in window && 'serviceWorker' in navigator) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      } else {
        console.log('Notification permission denied.');
      }
    });
  }
}

// Function to ensure data persistence when updating
export function ensureDataPersistence() {
  const savedKeys = [
    'morningRitualChecklist',
    'morningRitualChecklistDate',
    'morningRitualStreak',
    'favoriteExcerpts',
    'localExcerpts',
    'gratitudes',
    'affirmations',
    'streak',
    'last_sync'
  ];
  
  // Create a backup of critical local storage data
  const dataBackup = {};
  savedKeys.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      dataBackup[key] = value;
    }
  });
  
  // Store backup in sessionStorage as a safety measure during updates
  if (Object.keys(dataBackup).length > 0) {
    sessionStorage.setItem('dataBackup', JSON.stringify(dataBackup));
  }
  
  // Check if we need to restore from backup (after update)
  const backupData = sessionStorage.getItem('dataBackup');
  if (backupData) {
    try {
      const parsedBackup = JSON.parse(backupData);
      Object.keys(parsedBackup).forEach(key => {
        // Only restore if the key doesn't exist already
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, parsedBackup[key]);
        }
      });
      // Clear backup after successful restore
      sessionStorage.removeItem('dataBackup');
    } catch (error) {
      console.error('Error restoring data from backup:', error);
    }
  }
}
