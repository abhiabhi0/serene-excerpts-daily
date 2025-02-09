
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface BookFilterProps {
  availableBooks: string[];
  selectedBooks: string[];
  onSelectedBooksChange: (books: string[]) => void;
}

export function BookFilter({ availableBooks, selectedBooks, onSelectedBooksChange }: BookFilterProps) {
  const toggleBook = (bookTitle: string) => {
    if (selectedBooks.includes(bookTitle)) {
      onSelectedBooksChange(selectedBooks.filter((b) => b !== bookTitle));
    } else {
      onSelectedBooksChange([...selectedBooks, bookTitle]);
    }
  };

  const selectAll = () => onSelectedBooksChange(availableBooks);
  const clearAll = () => onSelectedBooksChange([]);

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={selectAll}
          className="text-xs"
        >
          Select All
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={clearAll}
          className="text-xs"
        >
          Clear All
        </Button>
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start bg-background/50 backdrop-blur-sm border-[#1A4067]/30"
          >
            <span>Filter by Books ({selectedBooks.length})</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-background/95 backdrop-blur-sm border-[#1A4067]/30">
          <Command>
            <CommandInput placeholder="Search books..." className="h-9" />
            <CommandEmpty>No books found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-auto">
              {availableBooks.map((book) => (
                <CommandItem
                  key={book}
                  onSelect={() => toggleBook(book)}
                  className="flex items-center gap-2"
                >
                  <div className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    selectedBooks.includes(book) ? "bg-primary text-primary-foreground" : "opacity-50"
                  )}>
                    {selectedBooks.includes(book) && (
                      <Check className="h-3 w-3" />
                    )}
                  </div>
                  <span>{book}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      
      {selectedBooks.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedBooks.map((book) => (
            <Badge
              key={book}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => toggleBook(book)}
            >
              {book}
              <span className="ml-1 text-xs">×</span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
