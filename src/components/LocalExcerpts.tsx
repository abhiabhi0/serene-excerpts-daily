
import { useState } from "react";
import { LocalExcerpt, LocalExcerptBook } from "@/types/localExcerpt";
import { ExcerptList } from "./ExcerptList";
import { ExcerptForm } from "./ExcerptForm";
import { Button } from "./ui/button";
import { ImportExport } from "./ImportExport";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { useToast } from "./ui/use-toast";

interface LocalExcerptsProps {
  onSelectForDisplay?: (excerpt: LocalExcerpt) => void;
  localExcerpts: LocalExcerpt[];
  setLocalExcerpts: (excerpts: LocalExcerpt[]) => void;
}

export const LocalExcerpts = ({ onSelectForDisplay, localExcerpts, setLocalExcerpts }: LocalExcerptsProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (excerpt: LocalExcerpt) => {
    const newExcerpts = [...localExcerpts, excerpt];
    setLocalExcerpts(newExcerpts);
    
    try {
      // Generate filename from book title
      const bookFileName = `${excerpt.bookTitle.toLowerCase().replace(/\s+/g, '-')}.json`;
      
      // Get existing book data if it exists
      const savedBookData = localStorage.getItem(bookFileName);
      let bookData: LocalExcerptBook;
      
      // Get existing files list
      const savedFiles = localStorage.getItem("files.json");
      const files: string[] = savedFiles ? JSON.parse(savedFiles) : [];
      
      if (savedBookData) {
        bookData = JSON.parse(savedBookData);
      } else {
        // Create new book data structure
        bookData = {
          metadata: {
            title: excerpt.bookTitle,
            author: excerpt.bookAuthor,
            translator: excerpt.translator,
            amazonLink: "",
            tags: [],
            category: excerpt.category,
            otherCategory: excerpt.otherCategory,
            language: excerpt.language
          },
          excerpts: []
        };

        // Update files.json if it's a new book
        if (!files.includes(bookFileName)) {
          files.push(bookFileName);
          localStorage.setItem("files.json", JSON.stringify(files));
        }
      }

      // Add new excerpt
      bookData.excerpts.push({
        text: excerpt.text,
        commentary: false
      });

      // Save book file
      localStorage.setItem(bookFileName, JSON.stringify(bookData));

      // Update files.json if it's a new book
      if (!files.includes(bookFileName)) {
        files.push(bookFileName);
        localStorage.setItem("files.json", JSON.stringify(files));
      }

      // Keep old format for backward compatibility
      localStorage.setItem("localExcerpts", JSON.stringify(newExcerpts));

      setIsFormOpen(false);
      
      if (onSelectForDisplay) {
        console.log("Automatically displaying new excerpt");
        onSelectForDisplay(excerpt);
      }

      toast({
        title: "Success",
        description: "Excerpt saved successfully.",
      });
    } catch (error) {
      console.error("Error saving excerpt:", error);
      toast({
        title: "Error",
        description: "Failed to save excerpt.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (excerptToDelete: LocalExcerpt) => {
    try {
      const bookFileName = `${excerptToDelete.bookTitle.toLowerCase().replace(/\s+/g, '-')}.json`;
      
      // Get book data
      const savedBookData = localStorage.getItem(bookFileName);
      if (savedBookData) {
        const bookData: LocalExcerptBook = JSON.parse(savedBookData);
        
        // Remove excerpt
        bookData.excerpts = bookData.excerpts.filter(e => e.text !== excerptToDelete.text);
        
        if (bookData.excerpts.length === 0) {
          // If no excerpts left, remove book file from files.json
          const savedFiles = localStorage.getItem("files.json");
          if (savedFiles) {
            const files: string[] = JSON.parse(savedFiles);
            const updatedFiles = files.filter(f => f !== bookFileName);
            localStorage.setItem("files.json", JSON.stringify(updatedFiles));
          }
          // Remove empty book file
          localStorage.removeItem(bookFileName);
        } else {
          // Update book file with remaining excerpts
          localStorage.setItem(bookFileName, JSON.stringify(bookData));
        }

        // Update local excerpts
        const updatedExcerpts = localExcerpts.filter(e => e.id !== excerptToDelete.id);
        setLocalExcerpts(updatedExcerpts);
        localStorage.setItem("localExcerpts", JSON.stringify(updatedExcerpts));

        toast({
          title: "Success",
          description: "Excerpt deleted successfully.",
        });
      }
    } catch (error) {
      console.error("Error deleting excerpt:", error);
      toast({
        title: "Error",
        description: "Failed to delete excerpt.",
        variant: "destructive"
      });
    }
  };

  const handleExcerptSelect = (excerpt: LocalExcerpt) => {
    if (onSelectForDisplay) {
      onSelectForDisplay(excerpt);
    }
  };

  return (
    <div className="space-y-4">
      <ExcerptList 
        excerpts={localExcerpts} 
        onSelectForDisplay={handleExcerptSelect}
        onDelete={handleDelete}
      />
      
      <div className="flex flex-col gap-4">
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Excerpt
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] p-0">
            <ScrollArea className="h-full max-h-[90vh] p-6">
              <ExcerptForm 
                onSubmit={handleSubmit}
                existingBooks={localExcerpts.map(e => e.bookTitle).filter((value, index, self) => self.indexOf(value) === index)}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <ImportExport 
          excerpts={localExcerpts} 
          onImport={(imported) => {
            setLocalExcerpts(imported);
            localStorage.setItem("localExcerpts", JSON.stringify(imported));
          }} 
        />
      </div>
    </div>
  );
};

