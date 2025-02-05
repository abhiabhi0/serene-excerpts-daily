import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { languages, categories } from "@/types/localExcerpt";

interface FormFieldsProps {
  formData: {
    bookTitle: string;
    bookAuthor: string;
    translator: string;
    category: string;
    otherCategory: string;
    language: string;
    text: string;
  };
  existingBooks: string[];
  onBookTitleChange: (value: string) => void;
  onFormDataChange: (field: string, value: string) => void;
}

export const FormFields = ({
  formData,
  existingBooks,
  onBookTitleChange,
  onFormDataChange,
}: FormFieldsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="bookTitle">Book Title *</Label>
        <Input
          id="bookTitle"
          value={formData.bookTitle}
          onChange={(e) => onBookTitleChange(e.target.value)}
          placeholder="Enter book title"
          list="book-suggestions"
        />
        <datalist id="book-suggestions">
          {existingBooks.map((book) => (
            <option key={book} value={book} />
          ))}
        </datalist>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bookAuthor">Author Name</Label>
        <Input
          id="bookAuthor"
          value={formData.bookAuthor}
          onChange={(e) => onFormDataChange('bookAuthor', e.target.value)}
          placeholder="Enter author name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="translator">Translator Name</Label>
        <Input
          id="translator"
          value={formData.translator}
          onChange={(e) => onFormDataChange('translator', e.target.value)}
          placeholder="Enter translator name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select
          value={formData.category}
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

      {formData.category === "Other" && (
        <div className="space-y-2">
          <Label htmlFor="otherCategory">Other Category Name</Label>
          <Input
            id="otherCategory"
            value={formData.otherCategory}
            onChange={(e) => onFormDataChange('otherCategory', e.target.value)}
            placeholder="Enter category name"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="language">Language *</Label>
        <Select
          value={formData.language}
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

      <div className="space-y-2">
        <Label htmlFor="text">Excerpt *</Label>
        <Textarea
          id="text"
          value={formData.text}
          onChange={(e) => onFormDataChange('text', e.target.value)}
          placeholder="Enter your excerpt"
          className="min-h-[150px]"
        />
      </div>
    </div>
  );
};