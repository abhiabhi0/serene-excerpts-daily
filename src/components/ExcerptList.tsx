
import { LocalExcerpt } from "@/types/localExcerpt";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BookOpen, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

interface ExcerptListProps {
  excerpts: LocalExcerpt[];
  onSelectForDisplay?: (excerpt: LocalExcerpt) => void;
  onDelete?: (excerpt: LocalExcerpt) => void;
}

interface GroupedExcerpts {
  [key: string]: LocalExcerpt[];
}

export const ExcerptList = ({ excerpts, onSelectForDisplay, onDelete }: ExcerptListProps) => {
  // Group excerpts by book title or author
  const groupedExcerpts = excerpts.reduce((acc: GroupedExcerpts, excerpt) => {
    const key = excerpt.bookTitle || excerpt.bookAuthor || 'Untitled';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(excerpt);
    return acc;
  }, {});

  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {Object.entries(groupedExcerpts).map(([groupTitle, groupExcerpts]) => (
        <AccordionItem 
          key={groupTitle} 
          value={groupTitle}
          className="bg-[#0A1929]/50 backdrop-blur-sm border border-[#1A4067]/30 rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-4 hover:bg-[#1A4067]/20">
            <span className="text-lg font-medium">{groupTitle}</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 p-4">
              {groupExcerpts.map((excerpt) => (
                <div 
                  key={excerpt.id} 
                  className="relative group flex items-start justify-between gap-4 p-2 rounded-lg hover:bg-[#1A4067]/10"
                >
                  <p className="text-sm text-left flex-1">{excerpt.text}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                      onClick={() => {
                        if (onSelectForDisplay) {
                          const displayExcerpt = {
                            ...excerpt,
                            bookTitle: excerpt.bookTitle || excerpt.bookAuthor
                          };
                          onSelectForDisplay(displayExcerpt);
                        }
                      }}
                    >
                      <BookOpen className="w-4 h-4" />
                    </Button>
                    {onDelete && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="shrink-0 opacity-70 hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Excerpt</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this excerpt? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(excerpt)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
