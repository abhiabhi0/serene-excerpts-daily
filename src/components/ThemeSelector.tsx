
import { useState, useRef, useEffect } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ThemeSelectorProps {
  themes: string[];
  selectedTheme: string | null;
  onThemeSelect: (theme: string | null) => void;
}

export const ThemeSelector = ({ themes, selectedTheme, onThemeSelect }: ThemeSelectorProps) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Check if scrolling is possible and update arrow visibility
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      
      // First determine if scrolling is even possible
      const canScroll = scrollWidth > clientWidth;
      
      // Only show arrows if scrolling is possible
      if (canScroll) {
        // Show left arrow if we're not at the beginning
        setShowLeftArrow(scrollLeft > 0);
        
        // Show right arrow if there's more content to scroll to
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
      } else {
        // If scrolling isn't possible, hide both arrows
        setShowLeftArrow(false);
        setShowRightArrow(false);
      }
      
      console.log("Scroll check:", {
        scrollLeft,
        scrollWidth,
        clientWidth,
        canScroll,
        showLeftArrow: canScroll && scrollLeft > 0,
        showRightArrow: canScroll && scrollLeft < scrollWidth - clientWidth
      });
    }
  };

  // Handle scroll buttons
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      // Average theme button width (including margin) is around 120px
      // Scroll by approximately 2 theme buttons
      const scrollAmount = 240;
      
      console.log(`Scrolling ${direction} by ${scrollAmount}px`);
      
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      
      // Check scroll again after animation completes
      setTimeout(checkScroll, 300);
    }
  };

  // Initial setup and event listeners
  useEffect(() => {
    // Check scroll on mount and after a short delay to ensure proper rendering
    checkScroll();
    
    // Sometimes content rendering can be delayed, so check again after a moment
    const initialCheckTimer = setTimeout(checkScroll, 100);
    
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      // Add scroll handler
      scrollContainer.addEventListener('scroll', checkScroll);
      
      // Add resize handler
      window.addEventListener('resize', checkScroll);
      
      // Use ResizeObserver for content changes
      const resizeObserver = new ResizeObserver(checkScroll);
      resizeObserver.observe(scrollContainer);
      
      return () => {
        clearTimeout(initialCheckTimer);
        scrollContainer.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
        resizeObserver.disconnect();
      };
    }
  }, []);

  // Recheck when themes change
  useEffect(() => {
    checkScroll();
    // Check again after a delay to ensure rendering is complete
    const themeChangeTimer = setTimeout(checkScroll, 100);
    return () => clearTimeout(themeChangeTimer);
  }, [themes]);

  return (
    <div className="w-full relative">
      {/* Left scroll arrow */}
      {showLeftArrow && (
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#0A1929]/80 hover:bg-[#1E2A3B] rounded-full p-1 shadow-md"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>
      )}
      
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div 
          ref={scrollContainerRef}
          className="flex w-max space-x-2 p-2"
        >
          <button
            onClick={() => onThemeSelect(null)}
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors",
              !selectedTheme 
                ? "bg-[#3B82F6] text-white"
                : "bg-[#1E2A3B] text-white/70 hover:bg-[#2C3B4F] hover:text-white"
            )}
          >
            All
          </button>
          {themes.map((theme) => (
            <button
              key={theme}
              onClick={() => onThemeSelect(theme)}
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors capitalize",
                selectedTheme === theme
                  ? "bg-[#3B82F6] text-white"
                  : "bg-[#1E2A3B] text-white/70 hover:bg-[#2C3B4F] hover:text-white"
              )}
            >
              {theme.replace(/-/g, ' ')}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
      
      {/* Right scroll arrow */}
      {showRightArrow && (
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#0A1929]/80 hover:bg-[#1E2A3B] rounded-full p-1 shadow-md"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5 text-white" />
        </button>
      )}
    </div>
  );
};
