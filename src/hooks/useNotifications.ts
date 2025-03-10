import { useState, useEffect } from 'react';
import React from 'react';
import { useToast } from "@/components/ui/use-toast";

type NotificationPermissionStatus = 'default' | 'granted' | 'denied';

export function useNotifications() {
  const { toast } = useToast();
  const [notificationStatus, setNotificationStatus] = useState<NotificationPermissionStatus>('default');

  // Check if notifications are supported and get the current permission status
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationStatus(Notification.permission as NotificationPermissionStatus);
    }
  }, []);

  // Function to schedule the morning ritual notification
  const scheduleMorningNotification = () => {
    if (Notification.permission === 'granted') {
      // Store in localStorage that notifications are enabled
      localStorage.setItem('morningRitualNotifications', 'enabled');
      
      // Calculate time until 7:00 AM tomorrow
      const now = new Date();
      const scheduledTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        13, // 7 AM
        0, // 0 minutes
        0 // 0 seconds
      );
      
      // If it's already past 7 AM, schedule for tomorrow
      if (now > scheduledTime) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }
      
      const timeUntilNotification = scheduledTime.getTime() - now.getTime();
      
      // Schedule the notification
      setTimeout(() => {
        const notification = new Notification('Morning Ritual', {
          body: 'Time for your morning ritual with Atmanam Viddhi. Start your day mindfully.',
          icon: '/favicon.ico'
        });
        
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
        
        // Schedule the next day's notification
        scheduleMorningNotification();
      }, timeUntilNotification);
    }
  };

  // Function to request notification permission
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Notifications Not Supported",
        description: "Your browser doesn't support notifications.",
        variant: "destructive"
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationStatus(permission as NotificationPermissionStatus);
      
      if (permission === 'granted') {
        // Send a test notification
        new Notification('Notifications Enabled', {
          body: 'You will now receive daily morning ritual reminders at 7:00 AM.',
          icon: '/favicon.ico'
        });
        
        // Schedule the morning notification
        scheduleMorningNotification();
        
        toast({
          title: "Notifications Enabled",
          description: "You'll receive daily morning ritual reminders at 7:00 AM.",
        });
      } else if (permission === 'denied') {
        toast({
          title: "Notifications Denied",
          description: "You won't receive morning ritual reminders.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: "Something went wrong",
        description: "Could not enable notifications. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Check if notifications were previously enabled on page load
  useEffect(() => {
    const checkNotificationSettings = () => {
      if (
        'Notification' in window && 
        Notification.permission === 'granted' && 
        localStorage.getItem('morningRitualNotifications') === 'enabled'
      ) {
        scheduleMorningNotification();
      }
    };

    checkNotificationSettings();
  }, []);

  // Render the notification button based on permission status
  const renderNotificationButton = () => {
    if (!('Notification' in window)) {
      return null; // Don't show button if notifications aren't supported
    }

    if (notificationStatus === 'granted') {
      return React.createElement(
        'button',
        { 
          className: "px-4 py-2 rounded-lg bg-green-600/30 text-green-200 text-sm font-medium hover:bg-green-500/40 transition-colors"
        },
        "✓ Morning Rituals Enabled"
      );
    }
    
    return React.createElement(
      'button',
      {
        onClick: requestNotificationPermission,
        className: "px-4 py-2 rounded-lg bg-blue-600/30 text-blue-200 text-sm font-medium hover:bg-blue-500/40 transition-colors animate-pulse"
      },
      "Get notified for Morning Rituals"
    );
  };

  return {
    notificationStatus,
    requestNotificationPermission,
    renderNotificationButton
  };
}