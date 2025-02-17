
export const checkNotificationPermission = async (): Promise<boolean> => {
  try {
    // Check if browser supports notifications
    if (!("Notification" in window)) {
      console.log("[Notification Service] Browser does not support notifications");
      return false;
    }

    // If already granted, return true
    if (Notification.permission === "granted") {
      console.log("[Notification Service] Notifications already granted");
      return true;
    }

    // If not denied, request permission
    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      console.log("[Notification Service] Permission request response:", permission);
      return permission === "granted";
    }

    console.log("[Notification Service] Notifications were previously denied");
    return false;
  } catch (error) {
    console.error("[Notification Service] Error:", error);
    return false;
  }
};

const sendWisdomNotification = () => {
  if (Notification.permission === "granted") {
    new Notification("Daily Wisdom", {
      body: "Time to check today's wisdom!",
      icon: "/favicon.ico"
    });
  }
};

// Simple test function to immediately send a notification
export const testNotification = async () => {
  const hasPermission = await checkNotificationPermission();
  if (hasPermission) {
    sendWisdomNotification();
    return true;
  }
  return false;
};
