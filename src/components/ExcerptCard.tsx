
import { ExcerptWithMeta, ExcerptCardProps } from "@/types/excerpt";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share as ShareIcon, ShoppingCart, RefreshCw, Instagram, Facebook } from "lucide-react";
import { Share } from '@capacitor/share';

export const ExcerptCard = ({ excerpt, onNewExcerpt }: ExcerptCardProps) => {
  const handleShare = async () => {
    try {
      const appUrl = "https://play.google.com/store/apps/details?id=your.app.id";
      await Share.share({
        title: `${excerpt.bookTitle || ''} ${excerpt.bookAuthor ? `by ${excerpt.bookAuthor}` : ''}`,
        text: `"${excerpt.text}"\n\nRead more spiritual excerpts on Atmanam Viddhi app:`,
        url: appUrl,
        dialogTitle: 'Share this excerpt'
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleBuyBook = () => {
    if (excerpt.amazonLink) {
      window.open(excerpt.amazonLink, '_blank');
    }
  };

  return (
    <div className="w-[98%] mx-auto space-y-4">
      {/* Excerpt Card */}
      <Card className="w-full bg-[#0A1929] border-[#1A4067]/30 backdrop-blur-sm">
        <CardContent className="pt-6 px-4">
          <blockquote className="text-lg mb-4 leading-relaxed text-left">
            "{excerpt.text}"
          </blockquote>
          <div className="text-sm text-muted-foreground space-y-1 text-left">
            {excerpt.bookTitle && <p className="font-semibold">{excerpt.bookTitle}</p>}
            {excerpt.bookAuthor && <p>by {excerpt.bookAuthor}</p>}
            {excerpt.translator && <p>translated by {excerpt.translator}</p>}
          </div>
          <div className="mt-6 pt-4 border-t border-[#1A4067]/30 text-sm text-center text-muted-foreground">
            <img 
              src="/lovable-uploads/ic_launcher_round.png" 
              alt="Atmanam Viddhi Logo" 
              className="w-8 h-8 mx-auto mb-2"
            />
            <p className="font-semibold">Atmanam Viddhi - Know Thyself</p>
            <p className="mt-1">Available on Google Play Store</p>
          </div>
        </CardContent>
      </Card>

      {excerpt.isLocal && (
        <p className="text-center text-sm text-muted-foreground italic">
          Take a screenshot and share your excerpt with the world!
        </p>
      )}

      {/* Action Buttons */}
      <Card className="w-full bg-[#0A1929] border-[#1A4067]/30 backdrop-blur-sm">
        <CardContent className="p-2">
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
              onClick={handleShare}
            >
              <ShareIcon className="w-4 h-4 mr-2" />
              Share
            </Button>
            {excerpt.amazonLink && (
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
        </CardContent>
      </Card>

      {/* Support Section - Now shown for both local and remote excerpts */}
      <Card className="w-full bg-[#0A1929] border-[#1A4067]/30 backdrop-blur-sm">
        <CardContent className="p-4 sm:p-6 text-center">
          <h2 className="text-lg font-semibold mb-4">Support Atmanam Viddhi</h2>
          <div className="flex flex-col items-center gap-4">
            <a href="https://www.buymeacoffee.com/botman1001">
              <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a book&emoji=📖&slug=botman1001&button_colour=BD5FFF&font_colour=ffffff&font_family=Comic&outline_colour=000000&coffee_colour=FFDD00" />
            </a>
          </div>
        </CardContent>
        <CardFooter className="p-4 sm:p-6 pt-0 flex justify-center gap-4">
          <a 
            href="https://instagram.com/atmanam.viddhi" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-pink-600 hover:text-pink-700"
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a 
            href="https://facebook.com/atmanam.viddhi" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700"
          >
            <Facebook className="w-6 h-6" />
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};
