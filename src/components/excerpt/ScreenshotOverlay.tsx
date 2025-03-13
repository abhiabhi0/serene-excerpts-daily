
import { ReactNode } from "react";

interface ScreenshotOverlayProps {
  isScreenshotMode: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export const ScreenshotOverlay = ({ isScreenshotMode, onToggle, children }: ScreenshotOverlayProps) => {
  return (
    <>
      {children}
      
      {isScreenshotMode && (
        <div 
          className="fixed inset-0 bg-black/50 -z-10" 
          onClick={onToggle}
        />
      )}
    </>
  );
};
