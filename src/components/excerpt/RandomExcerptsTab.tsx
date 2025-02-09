
import { ExcerptCard } from "@/components/ExcerptCard";
import { ExcerptWithMeta } from "@/types/excerpt";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
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
      {currentExcerpt && (
        <ExcerptCard 
          excerpt={currentExcerpt} 
          onNewExcerpt={() => handleNewExcerpt(selectedLanguages)} 
        />
      )}
      <div className="p-4 rounded-lg bg-white/5 space-y-2">
        <label className="block text-sm font-medium mb-2">Filter by Language</label>
        <div className="flex flex-col gap-2">
          <Select onValueChange={handleLanguageSelect}>
            <SelectTrigger className="w-full bg-background border border-white/10">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-white/10">
              {availableLanguages.map((language) => (
                <SelectItem key={language} value={language} className="hover:bg-white/5">
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedLanguages.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
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
      </div>
    </div>
  );
};
