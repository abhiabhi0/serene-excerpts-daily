
export const checkNotificationPermission = async (): Promise<boolean> => {
  try {
    if (!("Notification" in window)) {
      console.log("[Notification Service] Browser does not support notifications");
      return false;
    }

    console.log("[Notification Service] Current permission status:", Notification.permission);

    if (Notification.permission === "granted") {
      console.log("[Notification Service] Notifications already granted");
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      console.log("[Notification Service] Permission request response:", permission);
      return permission === "granted";
    }

    console.log("[Notification Service] Notifications were previously denied");
    return false;
  } catch (error) {
    console.error("[Notification Service] Error checking permission:", error);
    return false;
  }
};

export const scheduleWisdomNotification = () => {
  try {
    const now = new Date();
    const scheduledTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      11,
      11,
      0
    );

    // If current time is past 11:11 AM, schedule for next day
    if (now > scheduledTime) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();
    console.log("[Notification Service] Scheduling notification for:", scheduledTime.toLocaleString());
    console.log("[Notification Service] Time until next notification (ms):", timeUntilNotification);

    setTimeout(() => {
      console.log("[Notification Service] Timer triggered, sending notification...");
      sendWisdomNotification();
      // Schedule next notification after sending current one
      scheduleWisdomNotification();
    }, timeUntilNotification);

    localStorage.setItem('lastNotificationScheduled', scheduledTime.toISOString());
  } catch (error) {
    console.error("[Notification Service] Error scheduling notification:", error);
  }
};

const sendWisdomNotification = () => {
  try {
    if (Notification.permission !== "granted") {
      console.log("[Notification Service] Cannot send notification - no permission");
      return;
    }

    console.log("[Notification Service] Sending notification at:", new Date().toLocaleString());
    
    const notification = new Notification("Daily Wisdom Reminder", {
      body: "🌟 Take a moment to check today's wisdom and cultivate gratitude",
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      requireInteraction: true,
    });

    notification.onclick = () => {
      console.log("[Notification Service] Notification clicked at:", new Date().toLocaleString());
      window.focus();
      notification.close();
    };
  } catch (error) {
    console.error("[Notification Service] Error sending notification:", error);
  }
};

export const initializeNotifications = async () => {
  console.log("[Notification Service] Starting initialization...");
  
  try {
    const lastScheduled = localStorage.getItem('lastNotificationScheduled');
    console.log("[Notification Service] Last scheduled:", lastScheduled);
    
    const hasPermission = await checkNotificationPermission();
    console.log("[Notification Service] Has permission:", hasPermission);

    if (hasPermission) {
      if (!lastScheduled || new Date(lastScheduled) < new Date()) {
        console.log("[Notification Service] Scheduling new notification");
        scheduleWisdomNotification();
      } else {
        console.log("[Notification Service] Notification already scheduled for:", lastScheduled);
      }
      console.log("[Notification Service] Initialized successfully");
      return true;
    }
    
    console.log("[Notification Service] Failed to initialize - no permission");
    return false;
  } catch (error) {
    console.error("[Notification Service] Error during initialization:", error);
    return false;
  }
};
