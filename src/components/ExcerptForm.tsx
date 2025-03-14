import { useState, useEffect, useRef } from "react";
import { LocalExcerpt } from "@/types/localExcerpt";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { FormFields } from "./excerpt/FormFields";
import { Search } from "lucide-react";
import { useOptimizedScroll } from "@/hooks/useOptimizedScroll";

interface ExcerptFormProps {
  onSubmit: (excerpt: LocalExcerpt) => void;
  existingBooks: string[];
}

export const ExcerptForm = ({ onSubmit, existingBooks }: ExcerptFormProps) => {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const optimizedScroll = useOptimizedScroll();
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
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const viewportHeight = window.innerHeight;
      const keyboardHeight = window.outerHeight - viewportHeight;
      const isKeyboardOpen = keyboardHeight > 150; // Threshold for keyboard presence

      if (isKeyboardOpen && textareaRef.current) {
        textareaRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }

      setIsKeyboardVisible(isKeyboardOpen);
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    return () => window.visualViewport?.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      if (textareaRef.current) {
        setTimeout(() => {
          optimizedScroll(textareaRef.current, -100);
        }, 300);
      }
    };

    const textarea = textareaRef.current;
    textarea?.addEventListener('focus', handleFocus);
    return () => textarea?.removeEventListener('focus', handleFocus);
  }, [optimizedScroll]);

  const findExistingBookMetadata = (searchTerm: string) => {
    const savedExcerpts = localStorage.getItem("localExcerpts");
    if (!savedExcerpts) return null;
    
    const excerpts: LocalExcerpt[] = JSON.parse(savedExcerpts);
    return excerpts.find(e => 
      e.bookTitle.toLowerCase() === searchTerm.toLowerCase() ||
      (e.bookAuthor && e.bookAuthor.toLowerCase() === searchTerm.toLowerCase())
    );
  };

  const handleBookTitleChange = (value: string) => {
    setFormData(prev => ({ ...prev, bookTitle: value }));
    
    if (value.length > 0) {
      const savedExcerpts = localStorage.getItem("localExcerpts");
      const excerpts: LocalExcerpt[] = savedExcerpts ? JSON.parse(savedExcerpts) : [];
      
      const suggestions = new Set([
        ...excerpts
          .filter(e => e.bookTitle.toLowerCase().includes(value.toLowerCase()))
          .map(e => e.bookTitle),
        ...excerpts
          .filter(e => e.bookAuthor && e.bookAuthor.toLowerCase().includes(value.toLowerCase()))
          .map(e => e.bookAuthor)
      ]);
      
      setSuggestions(Array.from(suggestions));
    } else {
      setSuggestions([]);
    }
    
    const existingEntry = findExistingBookMetadata(value);
    if (existingEntry) {
      setFormData(prev => ({
        ...prev,
        bookTitle: existingEntry.bookTitle || "",
        bookAuthor: existingEntry.bookAuthor || "",
        translator: existingEntry.translator || "",
        category: existingEntry.category || "",
        language: existingEntry.language || "",
      }));
      
      toast({
        title: "Details Found",
        description: "Book/Author details have been automatically filled.",
      });
    }
  };

  const handleFormDataChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!formData.bookTitle && !formData.bookAuthor) || !formData.category || !formData.language || !formData.text) {
      toast({
        title: "Error",
        description: "Please fill in either Book Title or Author Name, and all other required fields",
        variant: "destructive",
      });
      return;
    }

    const newExcerpt: LocalExcerpt = {
      id: uuidv4(),
      ...formData,
      bookTitle: formData.bookTitle || formData.bookAuthor,
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
    <Card className={`w-full mx-auto bg-[#0F1A2A] border-[#1E2A3B] shadow-lg ${
      isKeyboardVisible ? 'mb-[40vh] pb-[env(safe-area-inset-bottom)]' : ''
    }`}>
      <CardContent className="pt-6 overflow-y-auto max-h-[80vh]" style={{ 
        paddingBottom: isKeyboardVisible ? 'env(safe-area-inset-bottom)' : undefined 
      }}>
        <form 
          ref={formRef} 
          onSubmit={handleSubmit} 
          className="w-full space-y-4"
          style={{
            minHeight: isKeyboardVisible ? 'calc(100vh - 60vh)' : undefined,
          }}
        >
          <div className="relative">
            <div className="flex items-center">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/50" />
              <input
                type="text"
                value={formData.bookTitle}
                onChange={(e) => handleBookTitleChange(e.target.value)}
                placeholder="Search by book title or author name"
                className="flex h-10 w-full rounded-md border border-[#1E2A3B] bg-[#0F1A2A] pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
              />
            </div>
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-[#0F1A2A] border border-[#1E2A3B] rounded-md shadow-lg max-h-60 overflow-auto">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-3 py-2 hover:bg-[#1A2737] cursor-pointer text-sm text-white"
                    onClick={() => handleBookTitleChange(suggestion)}
                  >
                    {suggestion}
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
            textareaRef={textareaRef}
          />

          <div className="flex gap-4">
            <Button 
              type="submit" 
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium"
            >
              Add Excerpt
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
