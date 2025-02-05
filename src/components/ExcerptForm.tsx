import { useState, useEffect } from "react";
import { LocalExcerpt, languages, categories } from "@/types/localExcerpt";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

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

  // Function to find existing book metadata
  const findExistingBookMetadata = (bookTitle: string) => {
    console.log("Finding metadata for book:", bookTitle);
    const savedExcerpts = localStorage.getItem("localExcerpts");
    if (!savedExcerpts) return null;
    
    const excerpts: LocalExcerpt[] = JSON.parse(savedExcerpts);
    return excerpts.find(e => e.bookTitle === bookTitle);
  };

  // Auto-fill book metadata when title is selected
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
    <Card className="w-full bg-[#0A1929] border-[#1A4067]/30 backdrop-blur-sm">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-2 w-full">
            <Label htmlFor="bookTitle" className="text-left block">Book Title *</Label>
            <Input
              id="bookTitle"
              value={formData.bookTitle}
              onChange={(e) => handleBookTitleChange(e.target.value)}
              placeholder="Enter book title"
              list="book-suggestions"
              className="w-full"
            />
            <datalist id="book-suggestions">
              {existingBooks.map((book) => (
                <option key={book} value={book} />
              ))}
            </datalist>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bookAuthor" className="text-left block">Author Name</Label>
            <Input
              id="bookAuthor"
              value={formData.bookAuthor}
              onChange={(e) =>
                setFormData({ ...formData, bookAuthor: e.target.value })
              }
              placeholder="Enter author name"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="translator" className="text-left block">Translator Name</Label>
            <Input
              id="translator"
              value={formData.translator}
              onChange={(e) =>
                setFormData({ ...formData, translator: e.target.value })
              }
              placeholder="Enter translator name"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-left block">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger className="w-full">
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
              <Label htmlFor="otherCategory" className="text-left block">Other Category Name</Label>
              <Input
                id="otherCategory"
                value={formData.otherCategory}
                onChange={(e) =>
                  setFormData({ ...formData, otherCategory: e.target.value })
                }
                placeholder="Enter category name"
                className="w-full"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="language" className="text-left block">Language *</Label>
            <Select
              value={formData.language}
              onValueChange={(value) =>
                setFormData({ ...formData, language: value })
              }
            >
              <SelectTrigger className="w-full">
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
            <Label htmlFor="text" className="text-left block">Excerpt *</Label>
            <Textarea
              id="text"
              value={formData.text}
              onChange={(e) =>
                setFormData({ ...formData, text: e.target.value })
              }
              placeholder="Enter your excerpt"
              className="min-h-[150px] w-full"
            />
          </div>

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