import { LocalExcerpt } from "@/types/localExcerpt";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
    <div className="w-full space-y-4">
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
                    <Card key={excerpt.id} className="w-[90vw] sm:w-[300px] flex-none">
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
  );
};