import { useState } from "react";
import { LocalExcerpt } from "@/types/localExcerpt";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { FormFields } from "./excerpt/FormFields";

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

  const findExistingBookMetadata = (bookTitle: string) => {
    console.log("Finding metadata for book:", bookTitle);
    const savedExcerpts = localStorage.getItem("localExcerpts");
    if (!savedExcerpts) return null;
    
    const excerpts: LocalExcerpt[] = JSON.parse(savedExcerpts);
    return excerpts.find(e => e.bookTitle === bookTitle);
  };

  const handleBookTitleChange = (value: string) => {
    setFormData(prev => ({ ...prev, bookTitle: value }));
    
    if (existingBooks.includes(value)) {
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
      }
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

    toast({
      title: "Success",
      description: "Excerpt added successfully! Remember to backup your excerpts regularly.",
    });
  };

  return (
    <Card className="w-[80vw] mx-auto bg-[#0A1929] border-[#1A4067]/30 backdrop-blur-sm">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <FormFields
            formData={formData}
            existingBooks={existingBooks}
            onBookTitleChange={handleBookTitleChange}
            onFormDataChange={handleFormDataChange}
          />
          <div className="flex gap-4">
            <Button type="submit" className="w-full">
              Add Excerpt
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};