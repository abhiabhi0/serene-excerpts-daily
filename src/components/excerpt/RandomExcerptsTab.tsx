
import { ExcerptCard } from "@/components/ExcerptCard";
import { ExcerptWithMeta } from "@/types/excerpt";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { getAvailableLanguages } from "@/services/excerptService";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

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
  const [availableLanguages] = useState(getAvailableLanguages());
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const handleLanguageSelect = (language: string) => {
    if (!selectedLanguages.includes(language)) {
      const newSelectedLanguages = [...selectedLanguages, language];
      setSelectedLanguages(newSelectedLanguages);
      handleNewExcerpt(newSelectedLanguages);
    }
  };

  const handleRemoveLanguage = (languageToRemove: string) => {
    const newSelectedLanguages = selectedLanguages.filter(lang => lang !== languageToRemove);
    setSelectedLanguages(newSelectedLanguages);
    handleNewExcerpt(newSelectedLanguages);
  };

  console.log("Available languages:", availableLanguages);

  return (
    <div className="relative">
      <div className="relative z-50">
        <Select onValueChange={handleLanguageSelect}>
          <SelectTrigger className="w-[200px] mb-4 bg-background border-input">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent 
            className="bg-background border border-input shadow-lg"
            position="popper"
            sideOffset={4}
          >
            {availableLanguages.map((language) => (
              <SelectItem 
                key={language} 
                value={language}
                className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
              >
                {language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedLanguages.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedLanguages.map((language) => (
              <Badge key={language} variant="outline" className="flex items-center gap-1">
                {language}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => handleRemoveLanguage(language)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-white/5 rounded-lg"></div>
          <div className="h-20 bg-white/5 rounded-lg"></div>
        </div>
      ) : (
        currentExcerpt && (
          <ExcerptCard 
            excerpt={currentExcerpt} 
            onNewExcerpt={() => handleNewExcerpt(selectedLanguages)} 
          />
        )
      )}
    </div>
  );
};

