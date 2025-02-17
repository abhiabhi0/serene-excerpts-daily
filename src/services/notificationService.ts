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
    // Production code for 11:11 AM notifications
    const now = new Date();
    const nextNotification = new Date();
    nextNotification.setHours(11, 11, 0, 0);

    if (now.getTime() > nextNotification.getTime()) {
      nextNotification.setDate(nextNotification.getDate() + 1);
    }

    // /*Testing code - uncomment to test every 2 seconds*/
    // const now = new Date().getTime();
    // const twoSeconds = 2 * 1000; // 2 seconds in milliseconds
    // const nextNotification = now + twoSeconds;
    

    localStorage.setItem(this.NEXT_NOTIFICATION_KEY, nextNotification.getTime().toString());
    this.startNotificationCheck(config);
  }

  private static startNotificationCheck(config: NotificationConfig): void {
    // Production code - checks every minute
    setInterval(() => {
      const storedTime = localStorage.getItem(this.NEXT_NOTIFICATION_KEY);
      if (!storedTime) return;

      const currentTime = new Date().getTime();
      if (currentTime >= parseInt(storedTime)) {
        this.showNotification(config);
        
        // Schedule next notification for tomorrow at 11:11 AM
        const nextTime = new Date();
        nextTime.setDate(nextTime.getDate() + 1);
        nextTime.setHours(11, 11, 0, 0);
        localStorage.setItem(this.NEXT_NOTIFICATION_KEY, nextTime.getTime().toString());

        // /* Testing code - uncomment to test every 2 seconds*/
        // const nextTime = currentTime + (2 * 1000);
        // localStorage.setItem(this.NEXT_NOTIFICATION_KEY, nextTime.toString());
        
      }
    }, 60000); // Production: Check every minute

    // /* Testing code - uncomment to check every second*/
    // }, 1000); // Testing: Check every second
    
  }  private static async showNotification(config: NotificationConfig): Promise<void> {
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