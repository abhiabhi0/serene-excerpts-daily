
import { Button } from "@/components/ui/button";
import { Share as ShareIcon, ShoppingCart, Bell } from "lucide-react";
import { ExcerptWithMeta } from "@/types/excerpt";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { initializeNotifications, checkNotificationPermission } from "@/services/notificationService";

interface ActionButtonsProps {
  excerpt: ExcerptWithMeta;
  onShare: () => void;
  onNewExcerpt: () => void;
}

export const ActionButtons = ({ excerpt, onShare, onNewExcerpt }: ActionButtonsProps) => {
  const { toast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    const checkNotifications = async () => {
      const permission = await checkNotificationPermission();
      setNotificationsEnabled(permission);
    };
    checkNotifications();
  }, []);

  const handleBuyBook = () => {
    if (excerpt.amazonLink) {
      window.open(excerpt.amazonLink, '_blank');
    }
  };

  const handleEnableNotifications = async () => {
    try {
      const enabled = await initializeNotifications();
      if (enabled) {
        setNotificationsEnabled(true);
        // Track subscription analytics
        const analyticsData = {
          event: 'notification_subscribe',
          timestamp: new Date().toISOString(),
          location: null as any
        };

        // Get user's location if they allow it
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              analyticsData.location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              };
              localStorage.setItem('notificationAnalytics', JSON.stringify(analyticsData));
            },
            () => {
              // If location is denied, still save the subscription data
              localStorage.setItem('notificationAnalytics', JSON.stringify(analyticsData));
            }
          );
        }

        toast({
          title: "Notifications Enabled",
          description: "You'll receive daily wisdom reminders at 11:11 AM",
        });
      } else {
        // Track failed subscription attempt
        const analyticsData = {
          event: 'notification_subscribe_failed',
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('notificationAnalytics', JSON.stringify(analyticsData));

        toast({
          variant: "destructive",
          title: "Notifications Not Enabled",
          description: "Please allow notifications in your browser settings to receive daily reminders.",
        });
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
    }
  };

  return (
    <div className="flex flex-wrap gap-4">
      <Button 
        variant="outline" 
        className="flex-1 min-w-[140px]"
        onClick={onNewExcerpt}
      >
        <img 
          src="/lovable-uploads/ic_launcher_round.png" 
          alt="New Excerpt" 
          className="w-4 h-4 mr-2"
        />
        New Excerpt
      </Button>
      <Button 
        variant="secondary"
        className="flex-1 min-w-[140px]"
        onClick={onShare}
      >
        <ShareIcon className="w-4 h-4 mr-2" />
        Share
      </Button>
      {excerpt.amazonLink && excerpt.amazonLink !== "" && (
        <Button 
          variant="default"
          className="flex-1 min-w-[140px]"
          onClick={handleBuyBook}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Buy Book
        </Button>
      )}
      {!notificationsEnabled && (
        <Button 
          variant="outline" 
          onClick={handleEnableNotifications}
          className="flex-1 min-w-[140px] bg-white/10 backdrop-blur-sm hover:bg-white/20"
        >
          <Bell className="w-4 h-4 mr-2" />
          Daily Reminders
        </Button>
      )}
    </div>
  );
};
