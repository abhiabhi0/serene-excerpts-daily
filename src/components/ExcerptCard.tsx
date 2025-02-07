
import { ExcerptWithMeta, ExcerptCardProps } from "@/types/excerpt";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Share } from '@capacitor/share';
import { useToast } from "@/components/ui/use-toast";
import { ExcerptContent } from "./excerpt/ExcerptContent";
import { ActionButtons } from "./excerpt/ActionButtons";
import { SupportSection } from "./excerpt/SupportSection";
import { useState } from "react";

export const ExcerptCard = ({ excerpt, onNewExcerpt, onScreenshotModeChange }: ExcerptCardProps) => {
  const { toast } = useToast();
  const [isScreenshotMode, setIsScreenshotMode] = useState(false);

  const handleShare = async () => {
    const websiteUrl = "https://atmanamviddhi.in";
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
          if (navigator.share) {
            await navigator.share(shareData);
            console.log("Web Share API successful");
            return;
          }
          
          await Share.share({
            title: shareData.title,
            text: shareData.text,
            url: websiteUrl,
            dialogTitle: 'Share this excerpt'
          });
          console.log("Capacitor Share successful");
        } catch (error) {
          console.log("Mobile sharing failed:", error);
          await navigator.clipboard.writeText(shareText);
          toast({
            title: "Text copied to clipboard",
            description: "You can now paste and share it anywhere",
          });
        }
      } else {
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

  const toggleScreenshotMode = () => {
    const newMode = !isScreenshotMode;
    setIsScreenshotMode(newMode);
    if (onScreenshotModeChange) {
      onScreenshotModeChange(newMode);
    }
  };

  return (
    <div className="w-[98%] mx-auto space-y-4">
      <div 
        className={`relative ${isScreenshotMode ? 'z-50' : ''}`}
        onClick={toggleScreenshotMode}
      >
        <Card className="w-full bg-[#0A1929]/70 border-[#1A4067]/30 backdrop-blur-sm">
          <CardContent>
            <ExcerptContent excerpt={excerpt} />
          </CardContent>
        </Card>
      </div>

      <div className={`transition-opacity duration-300 ${isScreenshotMode ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'}`}>
        {excerpt.isLocal && (
          <p className="text-center text-sm text-muted-foreground italic">
            Click on the excerpt to enter screenshot mode!
          </p>
        )}

        <Card className="w-full bg-[#0A1929]/70 border-[#1A4067]/30 backdrop-blur-sm">
          <CardContent className="p-2">
            <ActionButtons 
              excerpt={excerpt}
              onShare={handleShare}
              onNewExcerpt={onNewExcerpt}
            />
          </CardContent>
        </Card>

        <Card className="w-full bg-[#0A1929]/70 border-[#1A4067]/30 backdrop-blur-sm">
          <CardContent>
            <SupportSection />
          </CardContent>
        </Card>
      </div>

      {isScreenshotMode && (
        <div 
          className="fixed inset-0 bg-black/50 -z-10" 
          onClick={toggleScreenshotMode}
        />
      )}
    </div>
  );
};

