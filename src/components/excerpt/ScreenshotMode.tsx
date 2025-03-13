
import { useState } from "react";

export const useScreenshotMode = (onScreenshotModeChange?: (mode: boolean) => void) => {
  const [isScreenshotMode, setIsScreenshotMode] = useState(false);

  const toggleScreenshotMode = () => {
    const newMode = !isScreenshotMode;
    setIsScreenshotMode(newMode);
    if (onScreenshotModeChange) {
      onScreenshotModeChange(newMode);
    }
  };

  return { isScreenshotMode, toggleScreenshotMode };
};
