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
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select
          value={category}
          onValueChange={(value) => onFormDataChange('category', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
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
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="language">Language *</Label>
        <Select
          value={language}
          onValueChange={(value) => onFormDataChange('language', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent className="h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent hover:scrollbar-thumb-gray-500">
            <div className="p-2 font-semibold text-sm text-muted-foreground">Indian Languages</div>
            {languages
              .filter(lang => ["hi", "bn", "te", "mr", "ta", "ur", "gu", "kn", "ml", "pa", "sa"].includes(lang.code))
              .map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            
            <div className="p-2 font-semibold text-sm text-muted-foreground border-t mt-2">International Languages</div>
            {languages
              .filter(lang => !["hi", "bn", "te", "mr", "ta", "ur", "gu", "kn", "ml", "pa", "sa"].includes(lang.code))
              .map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};