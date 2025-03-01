import { messaging } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";

export const requestNotificationPermission = async () => {
  try {
    console.log("Requesting notification permission...");
    
    // First check if Notification API is supported
    if (!("Notification" in window)) {
      console.error("This browser does not support notifications");
      return null;
    }
    
    const permission = await Notification.requestPermission();
    console.log("Notification permission:", permission);
    
    if (permission === "granted") {
      try {
        console.log("Getting FCM token with VAPID key...");
        console.log("Messaging instance:", messaging);
        
        // Make sure messaging is initialized
        if (!messaging) {
          console.error("Firebase messaging is not initialized");
          return null;
        }
        
        // Check if vapid key is set
        if (!import.meta.env.VITE_FIREBASE_VAPID_KEY) {
          console.error("VAPID key is not set in environment variables");
          return null;
        }
        
        // Get token with more detailed error handling
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        }).catch(error => {
          console.error("Detailed FCM token error:", error);
          if (error.code) console.error("Error code:", error.code);
          if (error.message) console.error("Error message:", error.message);
          throw error;
        });
        
        console.log("FCM Token obtained:", token);
        return token;
      } catch (error) {
        console.error("Error getting FCM token:", error);
        
        // Fallback to basic notification without FCM
        console.log("Using basic notifications without FCM as fallback");
        return "basic-notification-fallback";
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

// Send token to your backend API
async function saveTokenToServer(token: string) {
  try {
    // Implementation depends on your backend
    // Example using fetch:
    /*
    await fetch('https://your-api.com/register-device', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    */
    console.log("Token saved to server:", token);
  } catch (error) {
    console.error("Failed to save token to server:", error);
  }
}

// Listen for foreground messages when browser is open
export const listenForNotifications = () => {
  onMessage(messaging, (payload) => {
    console.log("Foreground notification received:", payload);
    
    // Display notification to user
    if (Notification.permission === "granted") {
      const notificationTitle = payload.notification?.title || "Daily Wisdom";
      const notificationOptions = {
        body: payload.notification?.body || "New daily wisdom available",
        icon: "/favicon.ico", // Update with your icon path
        badge: "/favicon.ico",
        data: payload.data,
      };
      
      // Create and show notification
      new Notification(notificationTitle, notificationOptions);
    }
  });
};
