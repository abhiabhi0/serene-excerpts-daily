  import { Button } from "@/components/ui/button";
  import { Share as ShareIcon, ShoppingCart } from "lucide-react";
  import { ExcerptWithMeta } from "@/types/excerpt";

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
    const handleBuyBook = () => {
      if (excerpt.amazonLink) {
        window.open(excerpt.amazonLink, '_blank');
        
        // Track "Buy Book" click with proper parameters
        try {
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'buy_book_click', {
              'event_category': 'engagement',
              'event_label': excerpt || 'unknown',
            });
            console.log('Buy book event sent to GA');
          }
        } catch (error) {
          console.error('GA tracking error:', error);
        }
      }
    };

    // Add tracking wrapper for New Excerpt
    const handleNewExcerptWithAnalytics = () => {
      // Track New Excerpt click
      try {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'new_excerpt_click', {
            'event_category': 'engagement',
            'event_label': 'User requested new excerpt',
            'action_source': 'main_view',
            'user_interaction': 'button_click'
          });
          console.log('New excerpt event sent to GA');
        }
      } catch (error) {
        console.error('GA tracking error:', error);
      }

      // Call the original handler
      onNewExcerpt();
    };


    // Add tracking wrapper for Share
    const handleShareWithAnalytics = () => {
      // Track Share click
      try {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'share_click', {
            'event_category': 'engagement',
            'event_label': excerpt || excerpt.text?.substring(0, 30) || 'unknown',
            'content_type': 'excerpt',
            'share_method': 'button_click'
          });
          console.log('Share event sent to GA');
        }
      } catch (error) {
        console.error('GA tracking error:', error);
      }

      // Call the original handler
      onShare();
    };


    return (
      <div className="flex flex-wrap gap-4">
        <Button 
          variant="outline" 
          className="flex-1 min-w-[140px]"
          onClick={handleNewExcerptWithAnalytics} // Updated with analytics
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
          onClick={handleShareWithAnalytics} // Updated with analytics
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