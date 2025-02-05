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

  return (
    <div className="space-y-6">
      <Card className="bg-[#0A1929] border-[#1A4067]/30 backdrop-blur-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bookTitle">Book Title *</Label>
              <Input
                id="bookTitle"
                value={formData.bookTitle}
                onChange={(e) =>
                  setFormData({ ...formData, bookTitle: e.target.value })
                }
                placeholder="Enter book title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bookAuthor">Author Name</Label>
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
              <Label htmlFor="translator">Translator Name</Label>
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
              <Label htmlFor="category">Category *</Label>
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
                <Label htmlFor="otherCategory">Other Category Name</Label>
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
              <Label htmlFor="language">Language *</Label>
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
              <Label htmlFor="text">Excerpt *</Label>
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

            <Button type="submit" className="w-full">
              Add Excerpt
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {excerpts.map((excerpt) => (
          <Card
            key={excerpt.id}
            className="bg-[#0A1929] border-[#1A4067]/30 backdrop-blur-sm"
          >
            <CardContent className="pt-6">
              <blockquote className="text-lg mb-4 leading-relaxed">
                "{excerpt.text}"
              </blockquote>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-semibold">{excerpt.bookTitle}</p>
                {excerpt.bookAuthor && <p>by {excerpt.bookAuthor}</p>}
                {excerpt.translator && <p>translated by {excerpt.translator}</p>}
                <p>Category: {excerpt.category}</p>
                <p>
                  Language:{" "}
                  {languages.find((l) => l.code === excerpt.language)?.name}
                </p>
                <p className="text-xs">
                  Added on: {new Date(excerpt.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};