
import { FlattenedExcerpt } from "@/types/excerpt";
import { Book } from "@/types/excerpt";
import { transformBookToFlatExcerpts } from "@/utils/excerptTransformer";
import files from "../../public/data/files.json";

// Function to import all JSON files dynamically
const importAllBooks = async (): Promise<Book[]> => {
  const books: Book[] = [];
  
  for (const file of files) {
    try {
      const bookModule = await import(`../../public/data/${file}`);
      books.push(bookModule.default);
    } catch (error) {
      console.error(`Error importing ${file}:`, error);
    }
  }
  
  return books;
};

// Initialize empty arrays
export let staticExcerpts: FlattenedExcerpt[] = [];
export let staticLanguages: string[] = [];
export let staticBooks: {
  title: string;
  author: string | undefined;
  translator: string | undefined;
  language: string;
  excerptCount: number;
}[] = [];

// Function to update static arrays
const updateStaticArrays = async () => {
  const allBooks = await importAllBooks();
  
  // Update staticExcerpts
  staticExcerpts = allBooks.flatMap(book => 
    transformBookToFlatExcerpts(book)
  );

  // Update staticLanguages
  staticLanguages = Array.from(
    new Set(allBooks.map(book => book.metadata.language))
  ).sort();

  // Update staticBooks
  staticBooks = allBooks.map(book => ({
    title: book.metadata.title,
    author: book.metadata.author,
    translator: book.metadata.translator,
    language: book.metadata.language,
    excerptCount: book.excerpts.length
  }));

  // Log all static data
  console.log('All Static Excerpts:', staticExcerpts);
  console.log('All Languages:', staticLanguages);
  console.log('All Books:', staticBooks);
};

// Initialize arrays on module load
updateStaticArrays();

