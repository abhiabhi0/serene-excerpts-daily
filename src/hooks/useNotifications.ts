import { useEffect, useState } from 'react';
import { requestNotificationPermission, listenForNotifications } from '../lib/notifications';

export function useNotifications() {
  const [isPermissionGranted, setIsPermissionGranted] = useState(
    Notification.permission === 'granted'
  );
  
  const [fcmToken, setFcmToken] = useState<string | null>(
    localStorage.getItem('fcmToken')
  );
  
  useEffect(() => {
    // Check if browser supports notifications
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return;
    }
    
    // Initialize notifications
    async function initializeNotifications() {
      // If already granted, just get token
      if (Notification.permission === 'granted') {
        const token = await requestNotificationPermission();
        if (token) setFcmToken(token);
        listenForNotifications();
      }
    }
    
    initializeNotifications();
  }, []);
  
  // Function to request permission manually (e.g., from a button click)
  const requestPermission = async () => {
    const token = await requestNotificationPermission();
    if (token) {
      setFcmToken(token);
      setIsPermissionGranted(true);
      listenForNotifications();
      return true;
    }
    return false;
  };
  
  return {
    isPermissionGranted,
    fcmToken,
    requestPermission
  };
}
