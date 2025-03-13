
import { Button } from "@/components/ui/button";
import { Share as ShareIcon, ShoppingCart } from "lucide-react";
import { ExcerptWithMeta } from "@/types/excerpt";
import { useAnalyticsTracker } from "./AnalyticsTracker";

// Define gtag as a property of the window object
declare global {
  interface Window {
    gtag: (
      command: 'event', 
      action: string, 
      params: Record<string, any>
    ) => void;
  }
}

interface ActionButtonsProps {
  excerpt: ExcerptWithMeta;
  onShare: () => void;
  onNewExcerpt: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
}

export const ActionButtons = ({ 
  excerpt, 
  onShare, 
  onNewExcerpt
}: ActionButtonsProps) => {
  const { trackEvent } = useAnalyticsTracker();

  const handleBuyBook = () => {
    if (excerpt.amazonLink) {
      window.open(excerpt.amazonLink, '_blank');
      
      trackEvent({
        eventName: 'buy_book_click',
        params: {
          'event_category': 'engagement',
          'event_label': excerpt || 'unknown',
        }
      });
    }
  };

  // Add tracking wrapper for New Excerpt
  const handleNewExcerptWithAnalytics = () => {
    trackEvent({
      eventName: 'new_excerpt_click',
      params: {
        'event_category': 'engagement',
        'event_label': 'User requested new excerpt',
        'action_source': 'main_view',
        'user_interaction': 'button_click'
      }
    });

    // Call the original handler
    onNewExcerpt();
  };

  // Add tracking wrapper for Share
  const handleShareWithAnalytics = () => {
    trackEvent({
      eventName: 'share_click',
      params: {
        'event_category': 'engagement',
        'event_label': excerpt || excerpt.text?.substring(0, 30) || 'unknown',
        'content_type': 'excerpt',
        'share_method': 'button_click'
      }
    });

    // Call the original handler
    onShare();
  };

  return (
    <div className="flex flex-wrap gap-4">
      <Button 
        variant="outline" 
        className="flex-1 min-w-[140px]"
        onClick={handleNewExcerptWithAnalytics}
      >
        <img 
          src="/lovable-uploads/ic_launcher_round.png" 
          alt="New Excerpt" 
          className="w-4 h-4 mr-2"
        />
        New Excerpt
      </Button>
      <Button 
        variant="ghost"
        className="flex-1 min-w-[140px]"
        onClick={handleShareWithAnalytics}
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
    </div>
  );
};
