import { ExcerptWithMeta } from "@/types/excerpt";
import { Card, CardContent } from "@/components/ui/card";
import { ExcerptContent } from "./excerpt/ExcerptContent";
import { ActionButtons } from "./excerpt/ActionButtons";
import { SupportSection } from "./excerpt/SupportSection";
import { GratitudeAffirmations } from "./excerpt/GratitudeAffirmations";
import { useNotifications } from "@/hooks/useNotifications";
import { ScreenshotOverlay } from "./excerpt/ScreenshotOverlay";
import { useShareHandler } from "./excerpt/ShareHandler";
import { useFavoriteHandler } from "./excerpt/FavoriteHandler";
import { useScreenshotMode } from "./excerpt/ScreenshotMode";
import { Button } from "@/components/ui/button";
import { Bell, BellRing, Wind } from "lucide-react";
import { Link } from "react-router-dom";
import { UserAccountButton } from "./UserAccountButton";

interface ExcerptCardProps {
  excerpt: ExcerptWithMeta;
  onNewExcerpt: () => void;
  onScreenshotModeChange?: (mode: boolean) => void;
}

export const ExcerptCard = ({ excerpt, onNewExcerpt, onScreenshotModeChange }: ExcerptCardProps) => {
  // Extract functionality to custom hooks
  const { isSupported, isEnabled, requestNotificationPermission } = useNotifications();
  const { handleShare } = useShareHandler(excerpt);
  const { isFavorite, handleToggleFavorite } = useFavoriteHandler(excerpt);
  const { isScreenshotMode, toggleScreenshotMode } = useScreenshotMode(onScreenshotModeChange);
  
  const isHindi = excerpt.text.match(/[\u0900-\u097F]/);

  return (
    <div className="w-[98%] mx-auto space-y-4">
      {/* User Account Button */}
      <div className="flex justify-end gap-2">
        {isSupported && (
          <Button
            variant={isEnabled ? "ghost" : "outline"}
            size="icon"
            className={isEnabled ? "text-green-400" : "animate-pulse"}
            onClick={requestNotificationPermission}
          >
            {isEnabled ? <BellRing size={20} /> : <Bell size={20} />}
          </Button>
        )}
        <UserAccountButton />
      </div>
      
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
          <Card className="w-full bg-[#0A1929]/70 border-[#1A4067]/30 backdrop-blur-sm animate-[glowShadow_3s_ease-in-out_infinite] ">
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
          <Card className="w-full bg-[#0A1929]/70 border-[#1A4067]/30 backdrop-blur-sm mb-2">
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

          <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-700/20 mt-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium mb-1">One Minute Breathwork</h3>
                <p className="text-sm text-white/70">Take a short breathing break to re-center your mind</p>
              </div>
              <Link to="/breathwork">
                <Button variant="secondary" className="w-full md:w-auto flex items-center gap-2">
                  <Wind size={16} /> Start Breathing
                </Button>
              </Link>
            </div>
          </div>

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
