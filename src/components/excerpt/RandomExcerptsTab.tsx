
import { ExcerptCard } from "@/components/ExcerptCard";
import { ExcerptWithMeta } from "@/types/excerpt";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { getAllLanguages } from "@/services/excerptService";
import { useEffect, useState } from "react";

interface RandomExcerptsTabProps {
  currentExcerpt: ExcerptWithMeta | null;
  isLoading: boolean;
  handleNewExcerpt: (languages?: string[]) => void;
}

export const RandomExcerptsTab = ({ 
  currentExcerpt, 
  isLoading, 
  handleNewExcerpt 
}: RandomExcerptsTabProps) => {
  const [open, setOpen] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);

  useEffect(() => {
    const availableLanguages = getAllLanguages();
    console.log("Available languages:", availableLanguages);
    setLanguages(availableLanguages);
  }, []);

  const toggleLanguage = (language: string) => {
    setSelectedLanguages(current => {
      const isSelected = current.includes(language);
      if (isSelected) {
        return current.filter(l => l !== language);
      } else {
        return [...current, language];
      }
    });
  };

  useEffect(() => {
    handleNewExcerpt(selectedLanguages);
  }, [selectedLanguages]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-40 bg-white/5 rounded-lg"></div>
        <div className="h-20 bg-white/5 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between bg-background"
            >
              {selectedLanguages.length === 0
                ? "Select languages..."
                : `${selectedLanguages.length} languages selected`}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 bg-popover border rounded-md shadow-md">
            <Command>
              <CommandInput placeholder="Search languages..." />
              <CommandEmpty>No language found.</CommandEmpty>
              <CommandGroup className="max-h-[200px] overflow-y-auto">
                {languages.map((language) => (
                  <CommandItem
                    key={language}
                    onSelect={() => toggleLanguage(language)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedLanguages.includes(language) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {language}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        {selectedLanguages.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedLanguages.map(lang => (
              <Badge 
                key={lang}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => toggleLanguage(lang)}
              >
                {lang} ×
              </Badge>
            ))}
          </div>
        )}
      </div>
      {currentExcerpt ? (
        <ExcerptCard 
          excerpt={currentExcerpt} 
          onNewExcerpt={() => handleNewExcerpt(selectedLanguages)} 
        />
      ) : null}
    </div>
  );
};
