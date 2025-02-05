import { ExcerptWithMeta, ExcerptCardProps } from "@/types/excerpt";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share as ShareIcon, ShoppingCart, RefreshCw, Instagram, Facebook } from "lucide-react";
import { Share } from '@capacitor/share';

export const ExcerptCard = ({ excerpt, onNewExcerpt }: ExcerptCardProps) => {
  const handleShare = async () => {
    if (excerpt.isLocal) return;
    
    try {
      const appUrl = "https://play.google.com/store/apps/details?id=your.app.id";
      await Share.share({
        title: `${excerpt.bookTitle || ''} ${excerpt.bookAuthor ? `by ${excerpt.bookAuthor}` : ''}`,
        text: `"${excerpt.text}"\n\nRead more spiritual excerpts on Excerpt app:`,
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
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Excerpt Card */}
      <Card className="bg-[#0A1929] border-[#1A4067]/30 backdrop-blur-sm">
        <CardContent className="pt-6 px-4 sm:px-6">
          <blockquote className="text-lg mb-4 leading-relaxed">
            "{excerpt.text}"
          </blockquote>
          <div className="text-sm text-muted-foreground space-y-1">
            {excerpt.bookTitle && <p className="font-semibold">{excerpt.bookTitle}</p>}
            {excerpt.bookAuthor && <p>by {excerpt.bookAuthor}</p>}
            {excerpt.translator && <p>translated by {excerpt.translator}</p>}
          </div>
          {!excerpt.isLocal && (
            <div className="mt-6 pt-4 border-t border-[#1A4067]/30 text-sm text-center text-muted-foreground">
              <img 
                src="/lovable-uploads/6ef4d839-81dd-44d4-a345-1b9b13936176.png" 
                alt="Excerpt Logo" 
                className="w-8 h-8 mx-auto mb-2"
              />
              <p className="font-semibold">Excerpt - Daily Book Excerpts</p>
              <p className="mt-1">Available on Google Play Store</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card className="bg-[#0A1929] border-[#1A4067]/30 backdrop-blur-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="outline" 
              className="flex-1 min-w-[140px]"
              onClick={onNewExcerpt}
            >
              <img 
                src="/lovable-uploads/d306306a-eab4-4962-a421-fad5aabf1171.png" 
                alt="New Excerpt" 
                className="w-4 h-4 mr-2"
              />
              New Excerpt
            </Button>
            {!excerpt.isLocal && (
              <>
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
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Support Section */}
      {!excerpt.isLocal && (
        <Card className="bg-[#0A1929] border-[#1A4067]/30 backdrop-blur-sm">
          <CardContent className="p-4 sm:p-6 text-center">
            <h2 className="text-lg font-semibold mb-4">Support Excerpt</h2>
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
      )}
    </div>
  );
};