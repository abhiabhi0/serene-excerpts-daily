import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BookDetailsProps {
  bookTitle: string;
  bookAuthor: string;
  translator: string;
  existingBooks: string[];
  onBookTitleChange: (value: string) => void;
  onFormDataChange: (field: string, value: string) => void;
}

export const BookDetails = ({
  bookTitle,
  bookAuthor,
  translator,
  existingBooks,
  onBookTitleChange,
  onFormDataChange,
}: BookDetailsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bookTitle">Book Title *</Label>
        <Input
          id="bookTitle"
          value={bookTitle}
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
          value={bookAuthor}
          onChange={(e) => onFormDataChange('bookAuthor', e.target.value)}
          placeholder="Enter author name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="translator">Translator Name</Label>
        <Input
          id="translator"
          value={translator}
          onChange={(e) => onFormDataChange('translator', e.target.value)}
          placeholder="Enter translator name"
        />
      </div>
    </div>
  );
};