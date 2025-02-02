import { ExcerptWithMeta } from "@/types/excerpt";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share as ShareIcon, ShoppingCart } from "lucide-react";
import { Share } from '@capacitor/share';

interface ExcerptCardProps {
  excerpt: ExcerptWithMeta;
  onNewExcerpt: () => void;
}

export const ExcerptCard = ({ excerpt, onNewExcerpt }: ExcerptCardProps) => {
  const handleShare = async () => {
    try {
      await Share.share({
        title: `${excerpt.bookTitle} by ${excerpt.bookAuthor}`,
        text: `"${excerpt.text}"\n\nFrom ${excerpt.bookTitle} by ${excerpt.bookAuthor}`,
        url: excerpt.amazonLink,
        dialogTitle: 'Share this excerpt'
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleBuyBook = () => {
    window.open(excerpt.amazonLink, '_blank');
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-white/80 backdrop-blur-sm animate-fade-in">
      <CardContent className="pt-6 px-6">
        <blockquote className="text-lg mb-4 leading-relaxed">
          "{excerpt.text}"
        </blockquote>
        <div className="text-sm text-muted-foreground">
          <p className="font-semibold">{excerpt.bookTitle}</p>
          <p>by {excerpt.bookAuthor}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-between gap-4 px-6 pb-6">
        <Button 
          variant="outline" 
          className="flex-1 min-w-[120px]"
          onClick={onNewExcerpt}
        >
          New Excerpt
        </Button>
        <Button 
          variant="secondary"
          className="flex-1 min-w-[120px]"
          onClick={handleShare}
        >
          <ShareIcon className="w-4 h-4 mr-2" />
          Share
        </Button>
        {excerpt.amazonLink && (
          <Button 
            variant="default"
            className="flex-1 min-w-[120px]"
            onClick={handleBuyBook}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Buy Book
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};