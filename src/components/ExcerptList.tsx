import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { LocalExcerpt } from "@/types/localExcerpt";

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
    <div className="space-y-6 w-full max-w-[95vw] mx-auto">
      {getUniqueBooks().map((bookTitle) => (
        <div key={bookTitle} className="space-y-2">
          <h3 className="text-lg font-semibold">{bookTitle}</h3>
          <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <div className="flex w-max space-x-4 p-4">
              {getExcerptsForBook(bookTitle).map((excerpt) => (
                <Card key={excerpt.id} className="w-[95vw] sm:w-[95vw] md:w-[95vw] lg:w-[800px] flex-none">
                  <CardContent className="p-4">
                    <blockquote className="text-sm mb-2">"{excerpt.text}"</blockquote>
                    <div className="text-xs text-muted-foreground">
                      {excerpt.bookAuthor && <p>Author: {excerpt.bookAuthor}</p>}
                      {excerpt.translator && <p>Translator: {excerpt.translator}</p>}
                      <p>Category: {excerpt.category}</p>
                      <p>Language: {excerpt.language}</p>
                      <p>Added: {new Date(excerpt.createdAt).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      ))}
    </div>
  );
};