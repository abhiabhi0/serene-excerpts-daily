
import { BookDetails } from "./form/BookDetails";
import { CategoryLanguage } from "./form/CategoryLanguage";
import { ExcerptText } from "./form/ExcerptText";

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
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
}

export const FormFields = ({
  formData,
  existingBooks,
  onBookTitleChange,
  onFormDataChange,
  textareaRef
}: FormFieldsProps) => {
  return (
    <div className="space-y-6">
      <BookDetails
        bookTitle={formData.bookTitle}
        bookAuthor={formData.bookAuthor}
        translator={formData.translator}
        existingBooks={existingBooks}
        onBookTitleChange={onBookTitleChange}
        onFormDataChange={onFormDataChange}
      />
      <CategoryLanguage
        category={formData.category}
        otherCategory={formData.otherCategory}
        language={formData.language}
        onFormDataChange={onFormDataChange}
      />
      <ExcerptText
        text={formData.text}
        onFormDataChange={onFormDataChange}
        textareaRef={textareaRef}
      />
    </div>
  );
};
