declare function gtag(
  command: 'event',
  eventName: string,
  eventParams?: {
    [key: string]: any;
  }
): void;


  export const checkNotificationPermission = async (): Promise<boolean> => {
    if (!("Notification" in window)) {
      gtag('event', 'notification_not_supported');
      console.log("This browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      gtag('event', 'notification_active_subscription');
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      gtag('event', 'notification_permission_response', {
        'permission_status': permission
      });
      return permission === "granted";
    }

    gtag('event', 'notification_denied');
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

    if (now > scheduledTime) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();
    console.log("Time until next notification (ms):", timeUntilNotification);

    setTimeout(() => {
      console.log("Timer triggered, sending notification...");
      sendWisdomNotification();
      scheduleWisdomNotification();
    }, timeUntilNotification);

    localStorage.setItem('lastNotificationScheduled', scheduledTime.toISOString());
    gtag('event', 'notification_scheduled', {
      'scheduled_time': scheduledTime.toISOString()
    });
    console.log("Notification scheduled for:", scheduledTime);
  };
  const sendWisdomNotification = () => {
    if (Notification.permission === "granted") {
      console.log("Sending notification at:", new Date().toLocaleTimeString());
      
      const notification = new Notification("Daily Wisdom Reminder", {
        body: "🌟 Take a moment to check today's wisdom and cultivate gratitude",
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        requireInteraction: true,
      });

      console.log("Notification content:", {
        title: "Daily Wisdom Reminder",
        body: "🌟 Take a moment to check today's wisdom and cultivate gratitude",
        timestamp: new Date().toLocaleTimeString()
      });

      notification.onclick = () => {
        console.log("Notification clicked at:", new Date().toLocaleTimeString());
        window.focus();
        notification.close();
      };
    }
  };

  export const initializeNotifications = async () => {
    const lastScheduled = localStorage.getItem('lastNotificationScheduled');
    const hasPermission = await checkNotificationPermission();

    if (hasPermission) {
      if (!lastScheduled || new Date(lastScheduled) < new Date()) {
        scheduleWisdomNotification();
      }
      gtag('event', 'notifications_initialized');
      return true;
    }
    return false;
  };
