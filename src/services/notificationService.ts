
declare global {
  interface Window {
    gtag: (
      command: 'event',
      eventName: string,
      eventParams?: {
        [key: string]: any;
      }
    ) => void;
  }
}

export const checkNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    window.gtag?.('event', 'notification_not_supported');
    return false;
  }

  if (Notification.permission === "granted") {
    console.log("Notifications already granted");
    window.gtag?.('event', 'notification_active_subscription');
    return true;
  }

  if (Notification.permission !== "denied") {
    try {
      const permission = await Notification.requestPermission();
      console.log("Permission request response:", permission);
      window.gtag?.('event', 'notification_permission_response', {
        'permission_status': permission
      });
      return permission === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      window.gtag?.('event', 'notification_permission_error', {
        error: error?.toString()
      });
      return false;
    }
  }

  console.log("Notifications were previously denied");
  window.gtag?.('event', 'notification_denied');
  return false;
};

export const scheduleWisdomNotification = () => {
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
  console.log("Scheduling notification for:", scheduledTime.toLocaleString());
  console.log("Time until next notification (ms):", timeUntilNotification);

  setTimeout(() => {
    console.log("Timer triggered, sending notification...");
    sendWisdomNotification();
    // Schedule next notification after sending current one
    scheduleWisdomNotification();
  }, timeUntilNotification);

  localStorage.setItem('lastNotificationScheduled', scheduledTime.toISOString());
  window.gtag?.('event', 'notification_scheduled', {
    'scheduled_time': scheduledTime.toISOString()
  });
};

const sendWisdomNotification = () => {
  if (Notification.permission === "granted") {
    console.log("Sending notification at:", new Date().toLocaleString());
    
    try {
      const notification = new Notification("Daily Wisdom Reminder", {
        body: "🌟 Take a moment to check today's wisdom and cultivate gratitude",
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        requireInteraction: true,
      });

      window.gtag?.('event', 'notification_sent', {
        timestamp: new Date().toISOString()
      });

      notification.onclick = () => {
        console.log("Notification clicked at:", new Date().toLocaleString());
        window.gtag?.('event', 'notification_clicked');
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error("Error sending notification:", error);
      window.gtag?.('event', 'notification_send_error', {
        error: error?.toString()
      });
    }
  }
};

export const initializeNotifications = async () => {
  try {
    console.log("Initializing notifications...");
    const lastScheduled = localStorage.getItem('lastNotificationScheduled');
    const hasPermission = await checkNotificationPermission();

    if (hasPermission) {
      if (!lastScheduled || new Date(lastScheduled) < new Date()) {
        scheduleWisdomNotification();
      }
      window.gtag?.('event', 'notifications_initialized');
      console.log("Notifications initialized successfully");
      return true;
    }
    
    console.log("Failed to initialize notifications - no permission");
    return false;
  } catch (error) {
    console.error("Error initializing notifications:", error);
    window.gtag?.('event', 'notification_init_error', {
      error: error?.toString()
    });
    return false;
  }
};
