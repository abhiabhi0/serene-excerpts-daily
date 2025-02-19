
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, languages } from "@/types/localExcerpt";
import { useState } from "react";

interface CategoryLanguageProps {
  category: string;
  otherCategory: string;
  language: string;
  onFormDataChange: (field: string, value: string) => void;
}

export const CategoryLanguage = ({
  category,
  otherCategory,
  language,
  onFormDataChange,
}: CategoryLanguageProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indianLanguages = filteredLanguages.filter(lang => 
    ["hi", "bn", "te", "mr", "ta", "ur", "gu", "kn", "ml", "pa", "sa"].includes(lang.code)
  );

  const internationalLanguages = filteredLanguages.filter(lang => 
    !["hi", "bn", "te", "mr", "ta", "ur", "gu", "kn", "ml", "pa", "sa"].includes(lang.code)
  );

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select
          value={category}
          onValueChange={(value) => onFormDataChange('category', value)}
        >
          <SelectTrigger className="h-10 bg-[#0F1A2A] border-[#1E2A3B] text-white">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-[#0F1A2A] border-[#1E2A3B]">
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat} className="text-white hover:bg-[#1A2737] focus:bg-[#1A2737]">
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {category === "Other" && (
        <div className="space-y-2">
          <Label htmlFor="otherCategory">Custom Category</Label>
          <Input
            id="otherCategory"
            value={otherCategory}
            onChange={(e) => onFormDataChange('otherCategory', e.target.value)}
            placeholder="Enter your own category (optional)"
            className="bg-[#0F1A2A] border-[#1E2A3B] text-white"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="language">Language *</Label>
        <Select
          value={language}
          onValueChange={(value) => onFormDataChange('language', value)}
        >
          <SelectTrigger className="h-10 bg-[#0F1A2A] border-[#1E2A3B] text-white">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] bg-[#0F1A2A] border-[#1E2A3B]">
            <div className="p-2 sticky top-0 bg-[#0F1A2A] border-b border-[#1E2A3B]">
              <Input
                placeholder="Search language..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0F1A2A] border-[#1E2A3B] text-white h-8"
              />
            </div>

            {indianLanguages.length > 0 && (
              <>
                <div className="px-2 py-1.5 text-sm font-semibold text-white/70">Indian Languages</div>
                {indianLanguages.map((lang) => (
                  <SelectItem 
                    key={lang.code} 
                    value={lang.code}
                    className="text-white hover:bg-[#1A2737] focus:bg-[#1A2737]"
                  >
                    {lang.name}
                  </SelectItem>
                ))}
              </>
            )}
            
            {internationalLanguages.length > 0 && (
              <>
                <div className="px-2 py-1.5 text-sm font-semibold text-white/70 border-t border-[#1E2A3B] mt-1">
                  International Languages
                </div>
                {internationalLanguages.map((lang) => (
                  <SelectItem 
                    key={lang.code} 
                    value={lang.code}
                    className="text-white hover:bg-[#1A2737] focus:bg-[#1A2737]"
                  >
                    {lang.name}
                  </SelectItem>
                ))}
              </>
            )}

            {filteredLanguages.length === 0 && (
              <div className="p-2 text-sm text-white/70 text-center">
                No languages found
              </div>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
