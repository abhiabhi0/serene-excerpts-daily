
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { staticLanguages, staticBooks } from "@/data/staticExcerpts";
import { Label } from "@/components/ui/label";

interface FilterDropdownsProps {
  selectedLanguages: string[];
  selectedBooks: string[];
  onLanguagesChange: (languages: string[]) => void;
  onBooksChange: (books: string[]) => void;
}

export const FilterDropdowns = ({
  selectedLanguages,
  selectedBooks,
  onLanguagesChange,
  onBooksChange,
}: FilterDropdownsProps) => {
  const availableBooks = staticBooks.filter(book => 
    selectedLanguages.length === 0 || selectedLanguages.includes(book.language)
  );

  return (
    <div className="space-y-4 bg-white/5 p-4 rounded-lg mb-4">
      <div className="space-y-2">
        <Label>Filter by Language</Label>
        <Select
          value={selectedLanguages.join(",")}
          onValueChange={(value) => {
            const languages = value ? value.split(",") : [];
            onLanguagesChange(languages);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Languages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Languages</SelectItem>
            {staticLanguages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Filter by Book</Label>
        <Select
          value={selectedBooks.join(",")}
          onValueChange={(value) => {
            const books = value ? value.split(",") : [];
            onBooksChange(books);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Books" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Books</SelectItem>
            {availableBooks.map((book) => (
              <SelectItem key={book.title} value={book.title}>
                {book.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
