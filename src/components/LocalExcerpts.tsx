import { useState, useEffect } from "react";
import { LocalExcerpt } from "@/types/localExcerpt";
import { ExcerptList } from "./ExcerptList";
import { ExcerptForm } from "./ExcerptForm";
import { Button } from "./ui/button";
import { ImportExport } from "./ImportExport";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { useNavigate } from "react-router-dom";

interface LocalExcerptsProps {
  onSelectForDisplay?: (excerpt: LocalExcerpt) => void;
}

export const LocalExcerpts = ({ onSelectForDisplay }: LocalExcerptsProps) => {
  const [excerpts, setExcerpts] = useState<LocalExcerpt[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("localExcerpts");
    if (saved) {
      setExcerpts(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = (excerpt: LocalExcerpt) => {
    const newExcerpts = [...excerpts, excerpt];
    setExcerpts(newExcerpts);
    localStorage.setItem("localExcerpts", JSON.stringify(newExcerpts));
    setIsFormOpen(false);
    
    // Automatically display the new excerpt and switch to random tab
    if (onSelectForDisplay) {
      console.log("Automatically displaying new excerpt");
      onSelectForDisplay(excerpt);
      // Force a navigation to trigger tab switch
      navigate('/?tab=random');
    }
  };

  const handleExcerptSelect = (excerpt: LocalExcerpt) => {
    if (onSelectForDisplay) {
      onSelectForDisplay(excerpt);
      // Force a navigation to trigger tab switch
      navigate('/?tab=random');
    }
  };

  return (
    <div className="space-y-4">
      <ExcerptList excerpts={excerpts} onSelectForDisplay={handleExcerptSelect} />
      
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
                existingBooks={excerpts.map(e => e.bookTitle).filter((value, index, self) => self.indexOf(value) === index)}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <ImportExport 
          excerpts={excerpts} 
          onImport={(imported) => {
            setExcerpts(imported);
            localStorage.setItem("localExcerpts", JSON.stringify(imported));
          }} 
        />
      </div>
    </div>
  );
};