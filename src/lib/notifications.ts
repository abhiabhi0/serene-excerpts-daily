import { getMessagingInstance } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";

export const requestNotificationPermission = async () => {
  try {
    console.log("Requesting notification permission...");
    
    // First check if Notification API is supported
    if (typeof Notification === 'undefined') {
      console.error("This environment does not support notifications");
      return null;
    }
    
    const permission = await Notification.requestPermission();
    console.log("Notification permission:", permission);
    
    if (permission === "granted") {
      try {
        // Get messaging instance
        const messaging = getMessagingInstance();
        
        if (!messaging) {
          console.warn("Messaging not available or initialized");
          return null;
        }
        
        // Get token
        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
        
        if (!vapidKey) {
          console.error("VAPID key is not set in environment variables");
          return null;
        }
        
        const token = await getToken(messaging, { vapidKey });
        console.log("FCM Token obtained:", token);
        return token;
      } catch (error) {
        console.error("Error getting FCM token:", error);
        return null;
      }
    } else {
      console.warn("Notification permission denied");
      return null;
    }
  } catch (error) {
    console.error("Error in requestNotificationPermission:", error);
    return null;
  }
};

// Listen for foreground messages
export const listenForNotifications = () => {
  const messaging = getMessagingInstance();
  
  if (!messaging) {
    console.warn("Cannot listen for notifications - messaging not initialized");
    return;
  }
  
  onMessage(messaging, (payload) => {
    console.log("Foreground notification received:", payload);
    
    if (Notification.permission === "granted") {
      const notificationTitle = payload.notification?.title || "New Message";
      const notificationOptions = {
        body: payload.notification?.body,
        icon: "/favicon.ico"
      };
      
      new Notification(notificationTitle, notificationOptions);
    }
  });
};