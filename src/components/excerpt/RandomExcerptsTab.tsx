
import { ExcerptCard } from "@/components/ExcerptCard";
import { ExcerptWithMeta } from "@/types/excerpt";
import { languages } from "@/types/localExcerpt";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface RandomExcerptsTabProps {
  currentExcerpt: ExcerptWithMeta | null;
  isLoading: boolean;
  handleNewExcerpt: (selectedLanguages: string[]) => void;
}

export const RandomExcerptsTab = ({ 
  currentExcerpt, 
  isLoading, 
  handleNewExcerpt 
}: RandomExcerptsTabProps) => {
  const [open, setOpen] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['en']); // Default to English

  const toggleLanguage = (langCode: string) => {
    setSelectedLanguages(prev => {
      const isSelected = prev.includes(langCode);
      if (isSelected && prev.length === 1) {
        // Don't remove if it's the last selected language
        return prev;
      }
      return isSelected
        ? prev.filter(code => code !== langCode)
        : [...prev, langCode];
    });
  };

  const handleGetNewExcerpt = () => {
    handleNewExcerpt(selectedLanguages);
  };

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
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="justify-between bg-[#0A1929]/70 border-[#1A4067]/30 backdrop-blur-sm min-w-[200px]"
            >
              Select Languages
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0 bg-[#0A1929]/95 border-[#1A4067]/30">
            <Command>
              <CommandInput placeholder="Search languages..." />
              <CommandEmpty>No language found.</CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-y-auto">
                {languages.map((language) => (
                  <CommandItem
                    key={language.code}
                    value={language.code}
                    onSelect={() => toggleLanguage(language.code)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedLanguages.includes(language.code) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {language.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <div className="flex flex-wrap gap-2">
          {selectedLanguages.map(code => {
            const langName = languages.find(l => l.code === code)?.name;
            return (
              <Badge 
                key={code}
                variant="secondary"
                className="bg-[#1A4067]/30 hover:bg-[#1A4067]/50"
              >
                {langName}
              </Badge>
            );
          })}
        </div>
      </div>

      {currentExcerpt && (
        <ExcerptCard 
          excerpt={currentExcerpt} 
          onNewExcerpt={handleGetNewExcerpt} 
        />
      )}
    </div>
  );
};
