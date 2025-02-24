import { ExcerptWithMeta } from "@/types/excerpt";
import { Card, CardContent } from "@/components/ui/card";
import { Share } from '@capacitor/share';
import { useToast } from "@/components/ui/use-toast";
import { ExcerptContent } from "./excerpt/ExcerptContent";
import { ActionButtons } from "./excerpt/ActionButtons";
import { SupportSection } from "./excerpt/SupportSection";
import { GratitudeAffirmations } from "./excerpt/GratitudeAffirmations";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

interface ExcerptCardProps {
  excerpt: ExcerptWithMeta;
  onNewExcerpt: () => void;
  onScreenshotModeChange?: (mode: boolean) => void;
}

export const ExcerptCard = ({ excerpt, onNewExcerpt, onScreenshotModeChange }: ExcerptCardProps) => {
  const { toast } = useToast();
  const [isScreenshotMode, setIsScreenshotMode] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const isHindi = excerpt.text.match(/[\u0900-\u097F]/);

  useEffect(() => {
    // Check if excerpt is in favorites by id or text
    const favorites = JSON.parse(localStorage.getItem('favoriteExcerpts') || '[]');
    const isFav = favorites.some((fav: ExcerptWithMeta) => 
      (excerpt.id && fav.id === excerpt.id) || fav.text === excerpt.text
    );
    setIsFavorite(isFav);
  }, [excerpt]);

  const handleShare = async () => {
    const websiteUrl = "https://atmanamviddhi.in";
    const attribution = excerpt.bookTitle || excerpt.bookAuthor || '';
    const shareText = `${excerpt.text}\n\n~ ${attribution}\n\n${websiteUrl}`;

    try {
      // Try using the Share API for mobile devices
      await Share.share({
        text: shareText,
        dialogTitle: 'Share Excerpt',
      });
    } catch (error) {
      // Fallback to clipboard if Share API is not available
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Text copied to clipboard",
          description: "You can now paste and share it anywhere",
        });
      } catch (clipboardError) {
        console.error("Sharing failed:", clipboardError);
        toast({
          title: "Sharing failed", 
          description: "Unable to share at this time",
          variant: "destructive",
        });
      }
    }
  };

  const handleToggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteExcerpts') || '[]');
    
    if (isFavorite) {
      // Remove from favorites
      const updatedFavorites = favorites.filter((fav: ExcerptWithMeta) => 
        !((excerpt.id && fav.id === excerpt.id) || fav.text === excerpt.text)
      );
      localStorage.setItem('favoriteExcerpts', JSON.stringify(updatedFavorites));
      setIsFavorite(false);
      
      // Remove from local excerpts if it was added as a favorite
      const localExcerpts = JSON.parse(localStorage.getItem('localExcerpts') || '[]');
      const updatedLocalExcerpts = localExcerpts.filter((ex: any) => 
        !(ex.text === excerpt.text && ex.type === 'favorite')
      );
      localStorage.setItem('localExcerpts', JSON.stringify(updatedLocalExcerpts));
      
      toast({
        title: "Removed from favorites",
        description: "Excerpt has been removed from your collection",
      });
    } else {
      // Add to favorites
      const favoriteExcerpt = {
        ...excerpt,
        id: excerpt.id || uuidv4(),
        isFavorite: true
      };
      localStorage.setItem('favoriteExcerpts', JSON.stringify([...favorites, favoriteExcerpt]));
      setIsFavorite(true);

      // Add to local excerpts as a favorite
      const localExcerpt = {
        id: favoriteExcerpt.id,
        bookTitle: excerpt.bookTitle || 'Unknown',
        bookAuthor: excerpt.bookAuthor,
        translator: excerpt.translator,
        text: excerpt.text,
        category: excerpt.bookTitle || 'Favorites',
        language: 'en',
        createdAt: new Date().toISOString(),
        type: 'favorite' as const
      };

      const localExcerpts = JSON.parse(localStorage.getItem('localExcerpts') || '[]');
      localStorage.setItem('localExcerpts', JSON.stringify([...localExcerpts, localExcerpt]));

      toast({
        title: "Added to favorites",
        description: "Excerpt has been added to your collection",
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
      <div className="mt-4 relative" onClick={toggleScreenshotMode}>
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
            <ExcerptContent 
              excerpt={excerpt} 
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
            />
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
              onToggleFavorite={handleToggleFavorite}
              isFavorite={isFavorite}
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
