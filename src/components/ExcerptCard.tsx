
import { ExcerptWithMeta } from "@/types/excerpt";
import { Card, CardContent } from "@/components/ui/card";
import { ExcerptContent } from "./excerpt/ExcerptContent";
import { ActionButtons } from "./excerpt/ActionButtons";
import { SupportSection } from "./excerpt/SupportSection";
import { GratitudeAffirmations } from "./excerpt/GratitudeAffirmations";
import { useNotifications } from "@/hooks/useNotifications";
import { MorningRitualChecklist } from "./MorningRitualChecklist";
import { ScreenshotOverlay } from "./excerpt/ScreenshotOverlay";
import { useShareHandler } from "./excerpt/ShareHandler";
import { useFavoriteHandler } from "./excerpt/FavoriteHandler";
import { useScreenshotMode } from "./excerpt/ScreenshotMode";

interface ExcerptCardProps {
  excerpt: ExcerptWithMeta;
  onNewExcerpt: () => void;
  onScreenshotModeChange?: (mode: boolean) => void;
}

export const ExcerptCard = ({ excerpt, onNewExcerpt, onScreenshotModeChange }: ExcerptCardProps) => {
  // Extract functionality to custom hooks
  const { renderNotificationButton } = useNotifications();
  const { handleShare } = useShareHandler(excerpt);
  const { isFavorite, handleToggleFavorite } = useFavoriteHandler(excerpt);
  const { isScreenshotMode, toggleScreenshotMode } = useScreenshotMode(onScreenshotModeChange);
  
  const isHindi = excerpt.text.match(/[\u0900-\u097F]/);

  return (
    <div className="w-[98%] mx-auto space-y-4">
      <ScreenshotOverlay 
        isScreenshotMode={isScreenshotMode} 
        onToggle={toggleScreenshotMode}
      >
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

          <MorningRitualChecklist />
          <GratitudeAffirmations />

          <Card className="w-full bg-[#0A1929]/70 border-[#1A4067]/30 backdrop-blur-sm">
            <CardContent>
              <SupportSection />
            </CardContent>
          </Card>
        </div>
      </ScreenshotOverlay>
    </div>
  );
};
