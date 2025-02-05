import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { LocalExcerpt } from "@/types/localExcerpt";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ExcerptListProps {
  excerpts: LocalExcerpt[];
}

export const ExcerptList = ({ excerpts }: ExcerptListProps) => {
  const getUniqueBooks = () => {
    const books = new Set(excerpts.map(e => e.bookTitle));
    return Array.from(books);
  };

  const getExcerptsForBook = (bookTitle: string) => {
    return excerpts.filter(e => e.bookTitle === bookTitle);
  };

  return (
    <div className="w-[98%] mx-auto space-y-6">
      <Accordion type="single" collapsible className="w-full">
        {getUniqueBooks().map((bookTitle) => (
          <AccordionItem 
            key={bookTitle} 
            value={bookTitle}
            className="border-b border-[#1A4067]/30"
          >
            <AccordionTrigger className="text-left py-6 text-lg font-medium hover:text-primary transition-colors">
              {bookTitle}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pb-4">
                {getExcerptsForBook(bookTitle).map((excerpt) => (
                  <Card 
                    key={excerpt.id} 
                    className="bg-[#0A1929]/50 border-[#1A4067]/30 backdrop-blur-sm p-4"
                  >
                    <p className="text-left text-base leading-relaxed">
                      {excerpt.text}
                    </p>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};