import { ExcerptWithMeta, ExcerptCardProps } from "@/types/excerpt";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share as ShareIcon, ShoppingCart, RefreshCw, Instagram, Facebook, Copy } from "lucide-react";
import { Share } from '@capacitor/share';
import { useToast } from "@/components/ui/use-toast";

export const ExcerptCard = ({ excerpt, onNewExcerpt }: ExcerptCardProps) => {
  const { toast } = useToast();

  const handleShare = async () => {
    const websiteUrl = "https://atmanamviddhi.github.io";
    const shareText = `"${excerpt.text}"\n\n${excerpt.bookTitle || ''} ${excerpt.bookAuthor ? `by ${excerpt.bookAuthor}` : ''}\n\nRead more spiritual excerpts at: ${websiteUrl}`;
    
    const shareData = {
      title: `${excerpt.bookTitle || ''} ${excerpt.bookAuthor ? `by ${excerpt.bookAuthor}` : ''}`,
      text: shareText,
      url: websiteUrl
    };

    try {
      // Try Capacitor Share first
      await Share.share({
        ...shareData,
        dialogTitle: 'Share this excerpt'
      });
    } catch (error) {
      console.log("Capacitor Share failed, trying Web Share API:", error);
      
      // Fallback to Web Share API
      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          // If Web Share API is not available, copy to clipboard
          await navigator.clipboard.writeText(shareText);
          toast({
            title: "Text copied to clipboard",
            description: "You can now paste and share it anywhere",
          });
        }
      } catch (webShareError) {
        console.error("Web Share API error:", webShareError);
        // Try clipboard as last resort
        try {
          await navigator.clipboard.writeText(shareText);
          toast({
            title: "Text copied to clipboard",
            description: "You can now paste and share it anywhere",
          });
        } catch (clipboardError) {
          toast({
            title: "Sharing failed",
            description: "Unable to share or copy text at this time",
            variant: "destructive",
          });
        }
      }
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
            <p className="mt-1">atmanamviddhi.github.io</p>
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

      {/* Support Section */}
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