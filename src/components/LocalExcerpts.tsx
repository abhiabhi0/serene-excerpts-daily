import { useState } from "react";
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
import { ChevronDown, ChevronUp, Download, Upload } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const LocalExcerpts = () => {
  const { toast } = useToast();
  const [excerpts, setExcerpts] = useState<LocalExcerpt[]>(() => {
    const saved = localStorage.getItem("localExcerpts");
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({
    bookTitle: "",
    bookAuthor: "",
    translator: "",
    category: "",
    otherCategory: "",
    language: "",
    text: "",
  });

  const [expandedBook, setExpandedBook] = useState<string | null>(null);

  const handleBookSelect = (bookTitle: string) => {
    const existingExcerpt = excerpts.find(e => e.bookTitle === bookTitle);
    if (existingExcerpt) {
      setFormData({
        ...formData,
        bookTitle: existingExcerpt.bookTitle,
        bookAuthor: existingExcerpt.bookAuthor || "",
        translator: existingExcerpt.translator || "",
        category: existingExcerpt.category,
        otherCategory: "",
        language: existingExcerpt.language,
        text: ""
      });
    }
  };

  const getUniqueBooks = () => {
    const books = new Set(excerpts.map(e => e.bookTitle));
    return Array.from(books);
  };

  const getExcerptsForBook = (bookTitle: string) => {
    return excerpts.filter(e => e.bookTitle === bookTitle);
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

    const updatedExcerpts = [newExcerpt, ...excerpts];
    setExcerpts(updatedExcerpts);
    localStorage.setItem("localExcerpts", JSON.stringify(updatedExcerpts));

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

  const handleExport = () => {
    const dataStr = JSON.stringify(excerpts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-excerpts.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedExcerpts = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedExcerpts) && importedExcerpts.every(isValidExcerpt)) {
          setExcerpts(prev => [...importedExcerpts, ...prev]);
          localStorage.setItem("localExcerpts", JSON.stringify([...importedExcerpts, ...excerpts]));
          toast({
            title: "Success",
            description: "Excerpts imported successfully!",
          });
        } else {
          throw new Error("Invalid format");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Invalid file format",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const isValidExcerpt = (excerpt: any): excerpt is LocalExcerpt => {
    return typeof excerpt.id === 'string' &&
           typeof excerpt.bookTitle === 'string' &&
           typeof excerpt.category === 'string' &&
           typeof excerpt.language === 'string' &&
           typeof excerpt.text === 'string' &&
           typeof excerpt.createdAt === 'string';
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Existing Books Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-left">My Books</h2>
        <Accordion type="single" collapsible className="w-full">
          {getUniqueBooks().map((bookTitle) => (
            <AccordionItem key={bookTitle} value={bookTitle}>
              <AccordionTrigger className="text-left">
                {bookTitle}
              </AccordionTrigger>
              <AccordionContent>
                <ScrollArea className="w-full whitespace-nowrap rounded-md">
                  <div className="flex w-max space-x-4 p-4">
                    {getExcerptsForBook(bookTitle).map((excerpt) => (
                      <Card key={excerpt.id} className="w-[300px] flex-none">
                        <CardContent className="p-4">
                          <blockquote className="text-sm mb-2">"{excerpt.text}"</blockquote>
                          <div className="text-xs text-muted-foreground">
                            {excerpt.bookAuthor && <p>by {excerpt.bookAuthor}</p>}
                            {excerpt.translator && <p>translated by {excerpt.translator}</p>}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Add Excerpt Form */}
      <Card className="bg-[#0A1929] border-[#1A4067]/30 backdrop-blur-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bookTitle" className="text-left block">Book Title *</Label>
              <Input
                id="bookTitle"
                value={formData.bookTitle}
                onChange={(e) =>
                  setFormData({ ...formData, bookTitle: e.target.value })
                }
                placeholder="Enter book title"
                list="book-suggestions"
              />
              <datalist id="book-suggestions">
                {getUniqueBooks().map((book) => (
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
                <Label htmlFor="otherCategory" className="text-left block">Other Category Name</Label>
                <Input
                  id="otherCategory"
                  value={formData.otherCategory}
                  onChange={(e) =>
                    setFormData({ ...formData, otherCategory: e.target.value })
                  }
                  placeholder="Enter category name"
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
              <Label htmlFor="text" className="text-left block">Excerpt *</Label>
              <Textarea
                id="text"
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
                placeholder="Enter your excerpt"
                className="min-h-[150px]"
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

      {/* Import/Export Section */}
      <Card className="bg-[#0A1929] border-[#1A4067]/30 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleExport}
              className="flex-1"
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Excerpts
            </Button>
            <div className="flex-1">
              <Input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                id="import-file"
              />
              <Button 
                onClick={() => document.getElementById('import-file')?.click()}
                className="w-full"
                variant="outline"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Excerpts
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
