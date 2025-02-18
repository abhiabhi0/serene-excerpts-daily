
import { useState, useEffect } from "react";
import { LocalExcerpt } from "@/types/localExcerpt";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { FormFields } from "./excerpt/FormFields";
import { Search } from "lucide-react";

interface ExcerptFormProps {
  onSubmit: (excerpt: LocalExcerpt) => void;
  existingBooks: string[];
}

export const ExcerptForm = ({ onSubmit, existingBooks }: ExcerptFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    bookTitle: "",
    bookAuthor: "",
    translator: "",
    category: "",
    otherCategory: "",
    language: "",
    text: "",
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const findExistingBookMetadata = (bookTitle: string) => {
    console.log("Finding metadata for book:", bookTitle);
    const savedExcerpts = localStorage.getItem("localExcerpts");
    if (!savedExcerpts) return null;
    
    const excerpts: LocalExcerpt[] = JSON.parse(savedExcerpts);
    return excerpts.find(e => e.bookTitle.toLowerCase() === bookTitle.toLowerCase());
  };

  const handleBookTitleChange = (value: string) => {
    setFormData(prev => ({ ...prev, bookTitle: value }));
    
    // Filter suggestions based on input
    if (value.length > 0) {
      const filtered = existingBooks.filter(book => 
        book.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
    
    // Auto-fill if exact match found
    const existingBook = findExistingBookMetadata(value);
    if (existingBook) {
      console.log("Found existing book metadata:", existingBook);
      setFormData(prev => ({
        ...prev,
        bookTitle: value,
        bookAuthor: existingBook.bookAuthor || "",
        translator: existingBook.translator || "",
        category: existingBook.category || "",
        language: existingBook.language || "",
      }));
      
      toast({
        title: "Book Found",
        description: "Book details have been automatically filled.",
      });
    }
  };

  const handleFormDataChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.bookTitle || !formData.category || !formData.language || !formData.text) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newExcerpt: LocalExcerpt = {
      id: uuidv4(),
      ...formData,
      createdAt: new Date().toISOString(),
    };

    onSubmit(newExcerpt);
    setFormData({
      bookTitle: "",
      bookAuthor: "",
      translator: "",
      category: "",
      otherCategory: "",
      language: "",
      text: "",
    });
    setSuggestions([]);
  };

  return (
    <Card className="w-full mx-auto bg-[#0A1929] border-[#1A4067] shadow-lg">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="relative">
            <div className="flex items-center">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={formData.bookTitle}
                onChange={(e) => handleBookTitleChange(e.target.value)}
                placeholder="Search or enter book title"
                className="flex h-10 w-full rounded-md border border-input bg-background/80 pl-9 pr-3 py-2 text-sm font-medium text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto">
                {suggestions.map((book, index) => (
                  <li
                    key={index}
                    className="px-3 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm font-medium"
                    onClick={() => handleBookTitleChange(book)}
                  >
                    {book}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <FormFields
            formData={formData}
            existingBooks={existingBooks}
            onBookTitleChange={handleBookTitleChange}
            onFormDataChange={handleFormDataChange}
          />

          <div className="flex gap-4">
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              Add Excerpt
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
