import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Messaging with lazy loading
let messagingInstance = null;

async function initializeMessaging() {
  try {
    // Check if messaging is supported in this environment
    const isMessagingSupported = await isSupported();
    
    if (isMessagingSupported) {
      messagingInstance = getMessaging(app);
      console.log("Firebase Messaging initialized successfully");
      
      // Register service worker if in browser environment
      if (typeof window !== 'undefined' && "serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/firebase-messaging-sw.js")
          .then((registration) => {
            console.log("Service Worker registered successfully:", registration);
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error);
          });
      }
    } else {
      console.warn("Firebase Messaging is not supported in this environment");
    }
  } catch (error) {
    console.error("Error initializing Firebase Messaging:", error);
  }
}

// Don't initialize messaging during SSR
if (typeof window !== 'undefined') {
  initializeMessaging();
}

// Expose a function to get messaging instance
export function getMessagingInstance() {
  return messagingInstance;
}

export { app };