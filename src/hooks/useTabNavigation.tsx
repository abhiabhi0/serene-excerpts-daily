
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useGesture } from "@use-gesture/react";

export const useTabNavigation = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'random');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Bind swipe gestures
  useGesture(
    {
      onDrag: ({ direction: [dx], distance: [dist] }) => {
        if (dist < 50) return; // Minimum swipe distance
        
        if (dx > 0 && activeTab === 'random') {
          // Right swipe on Today's Wisdom -> go to My Collection
          setActiveTab('local');
          setSearchParams({ tab: 'local' });
        } else if (dx < 0 && activeTab === 'local') {
          // Left swipe on My Collection -> go to Today's Wisdom
          setActiveTab('random');
          setSearchParams({ tab: 'random' });
        }
      }
    },
    {
      target: window,
      eventOptions: { passive: false },
    }
  );

  return {
    activeTab,
    setActiveTab,
    setSearchParams
  };
};
