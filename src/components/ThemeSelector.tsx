
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ThemeSelectorProps {
  themes: string[];
  selectedTheme: string | null;
  onThemeSelect: (theme: string | null) => void;
}

export const ThemeSelector = ({ themes, selectedTheme, onThemeSelect }: ThemeSelectorProps) => {
  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md">
      <div className="flex w-max space-x-2 p-2">
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
  );
};
