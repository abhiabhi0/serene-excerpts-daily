import { useState, useEffect } from "react";
import { LocalExcerpt } from "@/types/localExcerpt";
import { ExcerptList } from "./ExcerptList";
import { ExcerptForm } from "./ExcerptForm";
import { Button } from "./ui/button";
import { ImportExport } from "./ImportExport";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

interface LocalExcerptsProps {
  onSelectForDisplay?: (excerpt: LocalExcerpt) => void;
}

export const LocalExcerpts = ({ onSelectForDisplay }: LocalExcerptsProps) => {
  const [excerpts, setExcerpts] = useState<LocalExcerpt[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

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
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Excerpt
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <ExcerptForm 
              onSubmit={handleSubmit}
              existingBooks={excerpts.map(e => e.bookTitle).filter((value, index, self) => self.indexOf(value) === index)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <ExcerptList excerpts={excerpts} onSelectForDisplay={onSelectForDisplay} />
      <div className="mt-8">
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