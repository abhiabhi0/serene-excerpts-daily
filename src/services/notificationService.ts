interface NotificationConfig {
  title: string;
  body: string;
  icon: string;
  badge: string;
  requireInteraction: boolean;
}

export class NotificationService {
  private static readonly NEXT_NOTIFICATION_KEY = 'next_notification_time';
  private static readonly DEFAULT_NOTIFICATION: NotificationConfig = {
    title: "Daily Wisdom Reminder",
    body: "🌟 Take a moment to check today's wisdom and cultivate gratitude",
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    requireInteraction: true
  };

  // Set this to true for testing notifications every 2 seconds
  private static readonly TESTING_MODE = false;

  public static async initialize(): Promise<void> {
    if ('serviceWorker' in navigator && 'Notification' in window) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  public static async requestPermission(): Promise<boolean> {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  public static scheduleDailyNotification(config: NotificationConfig = this.DEFAULT_NOTIFICATION): void {
    const now = new Date().getTime();

    if (this.TESTING_MODE) {
      // Testing: Set next notification 2 seconds from now
      const nextNotification = now + (2 * 1000);
      localStorage.setItem(this.NEXT_NOTIFICATION_KEY, nextNotification.toString());
      this.startNotificationCheck(config);
    } else {
      // Production: Set for 11:11 AM
      const nextNotification = new Date();
      nextNotification.setHours(11, 11, 0, 0);
      if (now > nextNotification.getTime()) {
        nextNotification.setDate(nextNotification.getDate() + 1);
      }
      localStorage.setItem(this.NEXT_NOTIFICATION_KEY, nextNotification.getTime().toString());
      this.startNotificationCheck(config);
    }
  }

  private static startNotificationCheck(config: NotificationConfig): void {
    const checkInterval = this.TESTING_MODE ? 1000 : 60000; // 1 second for testing, 1 minute for production

    setInterval(() => {
      const storedTime = localStorage.getItem(this.NEXT_NOTIFICATION_KEY);
      if (!storedTime) return;

      const currentTime = new Date().getTime();
      if (currentTime >= parseInt(storedTime)) {
        this.showNotification(config);
        
        if (this.TESTING_MODE) {
          // Schedule next test notification in 2 seconds
          const nextTime = currentTime + (2 * 1000);
          localStorage.setItem(this.NEXT_NOTIFICATION_KEY, nextTime.toString());
        } else {
          // Schedule next notification for tomorrow at 11:11 AM
          const nextTime = new Date();
          nextTime.setDate(nextTime.getDate() + 1);
          nextTime.setHours(11, 11, 0, 0);
          localStorage.setItem(this.NEXT_NOTIFICATION_KEY, nextTime.getTime().toString());
        }
      }
    }, checkInterval);
  }

  private static async showNotification(config: NotificationConfig): Promise<void> {
    if ('Notification' in window) {
      const notification = new Notification(config.title, {
        body: config.body,
        icon: config.icon,
        badge: config.badge,
        requireInteraction: config.requireInteraction
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  }
}