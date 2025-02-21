
import { ExcerptWithMeta, ExcerptCardProps } from "@/types/excerpt";
import { Card, CardContent } from "@/components/ui/card";
import { Share } from '@capacitor/share';
import { useToast } from "@/components/ui/use-toast";
import { ExcerptContent } from "./excerpt/ExcerptContent";
import { ActionButtons } from "./excerpt/ActionButtons";
import { SupportSection } from "./excerpt/SupportSection";
import { GratitudeAffirmations } from "./excerpt/GratitudeAffirmations";
import { useState } from "react";

export const ExcerptCard = ({ excerpt, onNewExcerpt, onScreenshotModeChange }: ExcerptCardProps) => {
  const { toast } = useToast();
  const [isScreenshotMode, setIsScreenshotMode] = useState(false);
  const isHindi = excerpt.text.match(/[\u0900-\u097F]/); // Check for Devanagari characters
    const handleShare = async () => {
      const websiteUrl = "https://atmanamviddhi.in";
      // Get source attribution - use author only if title is empty
      const attribution = excerpt.bookTitle || excerpt.bookAuthor || '';
    
      // Construct share text with specific formatting
      const shareText = `${excerpt.text}\n\n~ ${attribution}\n\n${websiteUrl}`;

      try {
        // Copy to clipboard for all devices
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Text copied to clipboard",
          description: "You can now paste and share it anywhere",
        });
      } catch (error) {
        console.error("Sharing failed:", error);
        toast({
          title: "Sharing failed", 
          description: "Unable to copy text at this time",
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
      <div className="mt-4 relative ${isScreenshotMode ? 'z-50' : ''}" onClick={toggleScreenshotMode}>
        <style>
          {`
            @keyframes glowShadow {
              0% { box-shadow: 0 0 10px 2px rgba(255,215,0,0.3); }
              50% { box-shadow: 0 0 15px 4px rgba(255,215,0,0.5); }
              100% { box-shadow: 0 0 10px 2px rgba(255,215,0,0.3); }
            }
          `}
        </style>
        <Card className="w-full bg-[#0A1929]/70 border-[#1A4067]/30 backdrop-blur-sm animate-[glowShadow_3s_ease-in-out_infinite]">
          <CardContent className={isHindi ? 'font-hindi' : ''}>
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

        <GratitudeAffirmations />

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
