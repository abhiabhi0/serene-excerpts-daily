
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
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1); // Reduced buffer for better detection
      
      // Debug log
      console.log({
        scrollLeft,
        scrollWidth,
        clientWidth,
        diff: scrollWidth - clientWidth,
        showRight: scrollLeft < scrollWidth - clientWidth - 1
      });
    }
  };

  // Handle scroll buttons - scroll approximately the width of two theme buttons
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      // Average theme button width (including margin) is around 120px
      // Scroll by approximately 2 theme buttons
      const scrollAmount = 240; 
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Set up initial scroll check and listeners
  useEffect(() => {
    // Initial check needs to wait for render to complete
    setTimeout(checkScroll, 100);
    
    const scrollContainer = scrollContainerRef.current;
    
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    
    // Create a ResizeObserver to detect content changes
    const resizeObserver = new ResizeObserver(() => {
      checkScroll();
    });
    
    if (scrollContainer) {
      resizeObserver.observe(scrollContainer);
    }
    
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScroll);
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  // Force check when themes change
  useEffect(() => {
    setTimeout(checkScroll, 100);
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
          onScroll={checkScroll}
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
      
      {/* Right scroll arrow - force it to show initially if there are enough themes */}
      {(showRightArrow || themes.length > 5) && (
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
