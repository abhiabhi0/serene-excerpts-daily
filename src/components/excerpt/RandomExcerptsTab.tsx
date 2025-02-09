
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
    console.log("Available languages:", availableLanguages);
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
      <div className="w-full max-w-xs bg-background">
        <Select
          value={selectedLanguage}
          onValueChange={setSelectedLanguage}
        >
          <SelectTrigger className="w-full bg-background">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent className="bg-background">
            {languages.map((language) => (
              <SelectItem key={language} value={language}>
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

