import { ExcerptWithMeta } from "@/types/excerpt";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share as ShareIcon, ShoppingCart, RefreshCw, Instagram, Facebook } from "lucide-react";
import { Share } from '@capacitor/share';
import { QRCodeSVG } from "qrcode.react";

interface ExcerptCardProps {
  excerpt: ExcerptWithMeta;
  onNewExcerpt: () => void;
}

export const ExcerptCard = ({ excerpt, onNewExcerpt }: ExcerptCardProps) => {
  const handleShare = async () => {
    try {
      const appUrl = "https://play.google.com/store/apps/details?id=your.app.id"; // Replace with your actual Play Store URL
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
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-6 px-6">
          <blockquote className="text-lg mb-4 leading-relaxed">
            "{excerpt.text}"
          </blockquote>
          <div className="text-sm text-muted-foreground space-y-1">
            {excerpt.bookTitle && <p className="font-semibold">{excerpt.bookTitle}</p>}
            {excerpt.bookAuthor && <p>by {excerpt.bookAuthor}</p>}
            {excerpt.translator && <p>translated by {excerpt.translator}</p>}
          </div>
          <div className="mt-6 pt-4 border-t text-sm text-center text-muted-foreground">
            <p className="font-semibold">Excerpt - Daily Book Excerpts</p>
            <p className="mt-1">Available on Google Play Store</p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardContent className="flex flex-wrap justify-between gap-4 p-6">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onNewExcerpt}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            New Excerpt
          </Button>
          <Button 
            variant="secondary"
            className="flex-1"
            onClick={handleShare}
          >
            <ShareIcon className="w-4 h-4 mr-2" />
            Share
          </Button>
          {excerpt.amazonLink && (
            <Button 
              variant="default"
              className="flex-1"
              onClick={handleBuyBook}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Buy Book
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Support Section */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <h2 className="text-lg font-semibold mb-4">Support Excerpt</h2>
          <div className="flex flex-col items-center gap-4">
          <script data-name="BMC-Widget" data-cfasync="false" src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js" data-id="botman1001" data-description="Support me on Buy me a coffee!" data-message="" data-color="#BD5FFF" data-position="Right" data-x_margin="18" data-y_margin="18"></script>
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0 flex justify-center gap-4">
          <a 
            href="https://instagram.com/your-handle" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-pink-600 hover:text-pink-700"
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a 
            href="https://facebook.com/your-page" 
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