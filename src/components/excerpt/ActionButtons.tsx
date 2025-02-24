
import { Button } from "@/components/ui/button";
import { Share as ShareIcon, ShoppingCart, Heart } from "lucide-react";
import { ExcerptWithMeta } from "@/types/excerpt";

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
  onNewExcerpt,
  onToggleFavorite,
  isFavorite 
}: ActionButtonsProps) => {
  const handleBuyBook = () => {
    if (excerpt.amazonLink) {
      window.open(excerpt.amazonLink, '_blank');
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
        variant="ghost"
        className="flex-1 min-w-[140px]"
        onClick={onShare}
      >
        <ShareIcon className="w-4 h-4 mr-2" />
        Share
      </Button>
      <Button
        variant="ghost"
        className={`flex-1 min-w-[140px] ${isFavorite ? 'text-red-500 hover:text-red-600' : 'hover:text-red-500'}`}
        onClick={onToggleFavorite}
      >
        <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
        {isFavorite ? 'Favorited' : 'Favorite'}
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
