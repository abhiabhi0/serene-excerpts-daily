
import { FlattenedExcerpt } from "@/types/excerpt";
import { Book } from "@/types/excerpt";
import { transformBookToFlatExcerpts } from "@/utils/excerptTransformer";
import files from "../../public/data/files.json";

// Function to import all JSON files dynamically
const importAllBooks = async (): Promise<Book[]> => {
  const books: Book[] = [];
  
  for (const file of files) {
    try {
      console.log(`Attempting to import ${file}...`);
      const bookModule = await import(`../../public/data/${file}`);
      if (bookModule && bookModule.default) {
        books.push(bookModule.default);
        console.log(`Successfully imported ${file}`);
      } else {
        console.error(`Invalid module format for ${file}`);
      }
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
  try {
    const allBooks = await importAllBooks();
    console.log(`Imported ${allBooks.length} books successfully`);
    
    if (allBooks.length === 0) {
      console.error("No books were imported successfully");
      return;
    }

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
  } catch (error) {
    console.error("Error updating static arrays:", error);
  }
};

// Initialize arrays on module load
updateStaticArrays();
