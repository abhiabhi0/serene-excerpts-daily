
export const checkNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

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

  // If it's already past 11:11 AM today, schedule for tomorrow
  if (now > scheduledTime) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const timeUntilNotification = scheduledTime.getTime() - now.getTime();

  setTimeout(() => {
    sendWisdomNotification();
    // Schedule next day's notification after sending
    scheduleWisdomNotification();
  }, timeUntilNotification);

  // Store the last scheduled time in localStorage
  localStorage.setItem('lastNotificationScheduled', scheduledTime.toISOString());
  console.log("Notification scheduled for:", scheduledTime);
};

const sendWisdomNotification = () => {
  if (Notification.permission === "granted") {
    const notification = new Notification("Daily Wisdom Reminder", {
      body: "🌟 Take a moment to check today's wisdom and cultivate gratitude",
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      requireInteraction: true,
    });

    notification.onclick = () => {
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
    return true;
  }
  return false;
};
