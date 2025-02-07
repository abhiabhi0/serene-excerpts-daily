
import { ExcerptWithMeta, ExcerptCardProps } from "@/types/excerpt";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Share } from '@capacitor/share';
import { useToast } from "@/components/ui/use-toast";
import { ExcerptContent } from "./excerpt/ExcerptContent";
import { ActionButtons } from "./excerpt/ActionButtons";
import { SupportSection } from "./excerpt/SupportSection";

export const ExcerptCard = ({ excerpt, onNewExcerpt }: ExcerptCardProps) => {
  const { toast } = useToast();

  const handleShare = async () => {
    const websiteUrl = "https://atmanamviddhi.github.io";
    const bookInfo = `${excerpt.bookTitle || ''} ${excerpt.bookAuthor ? `by ${excerpt.bookAuthor}` : ''}`.trim();
    const shareText = `"${excerpt.text}"\n${bookInfo}\n\nDiscover more spiritual wisdom at: ${websiteUrl}`;
    
    const shareData = {
      title: bookInfo,
      text: shareText,
      url: websiteUrl
    };

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    console.log("Device detection:", { isMobile, userAgent: navigator.userAgent });

    try {
      if (isMobile) {
        console.log("Attempting mobile share...");
        try {
          // Try Web Share API first for mobile browsers
          if (navigator.share) {
            await navigator.share(shareData);
            console.log("Web Share API successful");
            return;
          }
          
          // Fallback to Capacitor Share
          await Share.share({
            title: shareData.title,
            text: shareData.text,
            url: websiteUrl,
            dialogTitle: 'Share this excerpt'
          });
          console.log("Capacitor Share successful");
        } catch (error) {
          console.log("Mobile sharing failed:", error);
          // Fallback to clipboard
          await navigator.clipboard.writeText(shareText);
          toast({
            title: "Text copied to clipboard",
            description: "You can now paste and share it anywhere",
          });
        }
      } else {
        // Desktop behavior: Copy to clipboard and show toast
        console.log("Desktop sharing: copying to clipboard");
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Text copied to clipboard",
          description: "You can now paste and share it anywhere",
        });
      }
    } catch (error) {
      console.error("Sharing failed:", error);
      toast({
        title: "Sharing failed",
        description: "Unable to share or copy text at this time",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-[98%] mx-auto space-y-4">
      {/* Excerpt Card */}
      <Card className="w-full bg-[#0A1929]/80 border-[#1A4067]/30 backdrop-blur-sm">
        <CardContent>
          <ExcerptContent excerpt={excerpt} />
        </CardContent>
      </Card>

      {excerpt.isLocal && (
        <p className="text-center text-sm text-muted-foreground italic">
          Take a screenshot and share your excerpt with the world!
        </p>
      )}

      {/* Action Buttons */}
      <Card className="w-full bg-[#0A1929]/80 border-[#1A4067]/30 backdrop-blur-sm">
        <CardContent className="p-2">
          <ActionButtons 
            excerpt={excerpt}
            onShare={handleShare}
            onNewExcerpt={onNewExcerpt}
          />
        </CardContent>
      </Card>

      {/* Support Section */}
      <Card className="w-full bg-[#0A1929]/80 border-[#1A4067]/30 backdrop-blur-sm">
        <CardContent>
          <SupportSection />
        </CardContent>
      </Card>
    </div>
  );
};
