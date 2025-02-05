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
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {category === "Other" && (
        <div className="space-y-2">
          <Label htmlFor="otherCategory">Other Category Name</Label>
          <Input
            id="otherCategory"
            value={otherCategory}
            onChange={(e) => onFormDataChange('otherCategory', e.target.value)}
            placeholder="Enter category name"
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
          <SelectContent>
            {languages.map((lang) => (
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