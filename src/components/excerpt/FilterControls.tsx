import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { getLanguagesAndBooks } from "@/services/excerptService";

interface FilterControlsProps {
  selectedLanguages: string[];
  setSelectedLanguages: (languages: string[]) => void;
  selectedBooks: string[];
  setSelectedBooks: (books: string[]) => void;
}

export function FilterControls({
  selectedLanguages,
  setSelectedLanguages,
  selectedBooks,
  setSelectedBooks,
}: FilterControlsProps) {
  const [openLanguages, setOpenLanguages] = useState(false);
  const [openBooks, setOpenBooks] = useState(false);

  const { data } = useQuery({
    queryKey: ["languages-and-books"],
    queryFn: getLanguagesAndBooks,
  });

  const languages = data?.languages || [];
  const books = data?.books || [];

  const filteredBooks = selectedLanguages.length > 0
    ? books.filter(book => selectedLanguages.includes(book.language))
    : books;

  const toggleLanguage = (language: string) => {
    setSelectedLanguages(
      selectedLanguages.includes(language)
        ? selectedLanguages.filter((l) => l !== language)
        : [...selectedLanguages, language]
    );
  };

  const toggleBook = (bookTitle: string) => {
    setSelectedBooks(
      selectedBooks.includes(bookTitle)
        ? selectedBooks.filter((b) => b !== bookTitle)
        : [...selectedBooks, bookTitle]
    );
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Popover open={openLanguages} onOpenChange={setOpenLanguages}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openLanguages}
            className="justify-between w-full sm:w-[200px] bg-[#0A1929]/70 border-[#1A4067]/30 backdrop-blur-sm"
          >
            {selectedLanguages.length === 0
              ? "Select languages"
              : `${selectedLanguages.length} selected`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full sm:w-[200px] p-0 bg-[#0A1929]/90 border-[#1A4067]/30 backdrop-blur-sm">
          <Command>
            <CommandInput placeholder="Search languages..." />
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {languages.map((language) => (
                <CommandItem
                  key={language}
                  onSelect={() => toggleLanguage(language)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedLanguages.includes(language)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {language}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover open={openBooks} onOpenChange={setOpenBooks}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openBooks}
            className="justify-between w-full sm:w-[200px] bg-[#0A1929]/70 border-[#1A4067]/30 backdrop-blur-sm"
          >
            {selectedBooks.length === 0
              ? "Select books"
              : `${selectedBooks.length} selected`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full sm:w-[200px] p-0 bg-[#0A1929]/90 border-[#1A4067]/30 backdrop-blur-sm">
          <Command>
            <CommandInput placeholder="Search books..." />
            <CommandEmpty>No book found.</CommandEmpty>
            <CommandGroup>
              {filteredBooks.map((book) => (
                <CommandItem
                  key={book.title}
                  onSelect={() => toggleBook(book.title)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedBooks.includes(book.title)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {book.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
