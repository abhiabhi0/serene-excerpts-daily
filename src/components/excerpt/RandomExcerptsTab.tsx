
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
    // Immediately call getAllLanguages and set the result
    const availableLanguages = getAllLanguages();
    console.log("Available languages in component:", availableLanguages);
    setLanguages(availableLanguages);
  }, []); // Empty dependency array means this runs once when component mounts

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
        <label className="block text-sm font-medium mb-2">
          Select Language ({languages.length} available)
        </label>
        <Select
          value={selectedLanguage}
          onValueChange={setSelectedLanguage}
        >
          <SelectTrigger className="w-[200px] bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600">
            <SelectValue placeholder="Choose language" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
            {languages.map((language) => (
              <SelectItem 
                key={language} 
                value={language}
                className="text-black dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
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
