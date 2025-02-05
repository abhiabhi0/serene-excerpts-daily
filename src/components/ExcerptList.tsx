import { LocalExcerpt } from "@/types/localExcerpt";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

interface ExcerptListProps {
  excerpts: LocalExcerpt[];
  onSelectForDisplay?: (excerpt: LocalExcerpt) => void;
}

export const ExcerptList = ({ excerpts, onSelectForDisplay }: ExcerptListProps) => {
  // Group excerpts by book title
  const groupedExcerpts = excerpts.reduce((acc, excerpt) => {
    const bookTitle = excerpt.bookTitle || 'Untitled';
    if (!acc[bookTitle]) {
      acc[bookTitle] = [];
    }
    acc[bookTitle].push(excerpt);
    return acc;
  }, {} as Record<string, LocalExcerpt[]>);

  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {Object.entries(groupedExcerpts).map(([bookTitle, bookExcerpts]) => (
        <AccordionItem 
          key={bookTitle} 
          value={bookTitle}
          className="bg-[#0A1929]/50 backdrop-blur-sm border border-[#1A4067]/30 rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-4 hover:bg-[#1A4067]/20">
            <span className="text-lg font-medium">{bookTitle}</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 p-4">
              {bookExcerpts.map((excerpt) => (
                <div 
                  key={excerpt.id} 
                  className="relative group"
                >
                  <p className="text-sm text-left pr-12">{excerpt.text}</p>
                  {onSelectForDisplay && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => onSelectForDisplay(excerpt)}
                    >
                      <BookOpen className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};