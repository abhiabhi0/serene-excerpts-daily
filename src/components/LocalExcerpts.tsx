
import { LocalExcerpt } from "@/types/localExcerpt";
import { ExcerptList } from "./ExcerptList";
import { ExcerptForm } from "./ExcerptForm";
import { Button } from "./ui/button";
import { ImportExport } from "./ImportExport";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

interface LocalExcerptsProps {
  onSelectForDisplay?: (excerpt: LocalExcerpt) => void;
  localExcerpts: LocalExcerpt[];
  setLocalExcerpts: (excerpts: LocalExcerpt[]) => void;
}

export const LocalExcerpts = ({ onSelectForDisplay, localExcerpts, setLocalExcerpts }: LocalExcerptsProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = (excerpt: LocalExcerpt) => {
    const newExcerpts = [...localExcerpts, excerpt];
    setLocalExcerpts(newExcerpts);
    localStorage.setItem("localExcerpts", JSON.stringify(newExcerpts));
    setIsFormOpen(false);
    
    if (onSelectForDisplay) {
      console.log("Automatically displaying new excerpt");
      onSelectForDisplay(excerpt);
    }
  };

  const handleExcerptSelect = (excerpt: LocalExcerpt) => {
    if (onSelectForDisplay) {
      onSelectForDisplay(excerpt);
    }
  };

  return (
    <div className="space-y-4">
      <ExcerptList excerpts={localExcerpts} onSelectForDisplay={handleExcerptSelect} />
      
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
