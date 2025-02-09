
import { useEffect, useState } from "react";
import { ExcerptCard } from "@/components/ExcerptCard";
import { ExcerptWithMeta } from "@/types/excerpt";
import { getAllLanguages } from "@/services/excerptService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RandomExcerptsTabProps {
  currentExcerpt: ExcerptWithMeta | null;
  isLoading: boolean;
  handleNewExcerpt: () => void;
}

export const RandomExcerptsTab = ({ 
  currentExcerpt, 
  isLoading, 
  handleNewExcerpt 
}: RandomExcerptsTabProps) => {
  const [languages, setLanguages] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");

  useEffect(() => {
    const availableLanguages = getAllLanguages();
    console.log("Available languages in component:", availableLanguages);
    setLanguages(availableLanguages);
  }, []);

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
      <div className="w-full max-w-xs">
        <Select
          value={selectedLanguage}
          onValueChange={setSelectedLanguage}
        >
          <SelectTrigger className="w-full bg-background text-foreground border border-input">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent className="bg-background border border-input">
            {languages.map((language) => (
              <SelectItem 
                key={language} 
                value={language}
                className="cursor-pointer hover:bg-accent"
              >
                {language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {currentExcerpt && (
        <ExcerptCard 
          excerpt={currentExcerpt} 
          onNewExcerpt={handleNewExcerpt} 
        />
      )}
    </div>
  );
};
