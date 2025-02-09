import { Book, ExcerptWithMeta } from "@/types/excerpt";
import { getLanguageLabel } from "@/config/languages";

interface LanguagesAndBooks {
  languages: string[];
  books: Array<{
    title: string;
    language: string;
  }>;
}

export const getLanguagesAndBooks = async (): Promise<LanguagesAndBooks> => {
  try {
    console.log("Fetching files list...");
    const filesResponse = await fetch("/data/files.json");
    if (!filesResponse.ok) {
      console.error(`Failed to fetch files list: ${filesResponse.statusText}`);
      return { languages: [], books: [] };
    }
    
    const files: string[] = await filesResponse.json();
    const books: Array<{title: string; language: string}> = [];
    const languagesSet = new Set<string>();

    const fetchPromises = files.map(async (file) => {
      try {
        console.log(`Fetching book data for ${file}...`);
        const bookResponse = await fetch(`/data/${file}`);
        if (!bookResponse.ok) {
          console.error(`Failed to fetch book data for ${file}: ${bookResponse.statusText}`);
          return;
        }
        const book: Book = await bookResponse.json();
        if (book.metadata?.language) {
          const languageLabel = getLanguageLabel(book.metadata.language);
          languagesSet.add(languageLabel);
          books.push({
            title: book.metadata.title,
            language: languageLabel
          });
        }
      } catch (error) {
        console.error(`Error processing book ${file}:`, error);
      }
    });

    await Promise.allSettled(fetchPromises);

    const result = {
      languages: Array.from(languagesSet),
      books
    };
    console.log("Processed languages and books:", result);
    return result;

  } catch (error) {
    console.error("Error in getLanguagesAndBooks:", error);
    return { languages: [], books: [] };
  }
};

export const getRandomExcerpt = async (
  selectedLanguages: string[] = [],
  selectedBooks: string[] = []
): Promise<ExcerptWithMeta> => {
  try {
    console.log("Fetching files list...");
    const filesResponse = await fetch("/data/files.json");
    if (!filesResponse.ok) {
      throw new Error(`Failed to fetch files list: ${filesResponse.statusText}`);
    }
    
    const files: string[] = await filesResponse.json();
    if (!files.length) {
      throw new Error("No excerpt files available");
    }

    let filteredFiles = [...files];
    
    if (selectedLanguages.length > 0 || selectedBooks.length > 0) {
      const validFiles = [];
      for (const file of files) {
        try {
          const bookResponse = await fetch(`/data/${file}`);
          if (!bookResponse.ok) {
            console.error(`Failed to fetch book data for ${file}: ${bookResponse.statusText}`);
            continue;
          }
          const book: Book = await bookResponse.json();
          const languageMatch = selectedLanguages.length === 0 || selectedLanguages.includes(book.metadata?.language || '');
          const bookMatch = selectedBooks.length === 0 || selectedBooks.includes(book.metadata.title);
          
          if (languageMatch && bookMatch) {
            validFiles.push(file);
          }
        } catch (error) {
          console.error(`Error processing book ${file}:`, error);
          continue;
        }
      }
      filteredFiles = validFiles;
    }

    if (filteredFiles.length === 0) {
      throw new Error("No matching excerpts found");
    }
    
    const randomBookFile = filteredFiles[Math.floor(Math.random() * filteredFiles.length)];
    console.log("Selected book file:", randomBookFile);
    
    const bookResponse = await fetch(`/data/${randomBookFile}`);
    if (!bookResponse.ok) {
      throw new Error(`Failed to fetch book data: ${bookResponse.statusText}`);
    }
    
    const book: Book = await bookResponse.json();
    const randomExcerpt = book.excerpts[Math.floor(Math.random() * book.excerpts.length)];
    
    return {
      ...randomExcerpt,
      bookTitle: book.metadata.title,
      bookAuthor: book.metadata.author,
      translator: book.metadata.translator,
      amazonLink: book.metadata.amazonLink,
    };
  } catch (error) {
    console.error("Error fetching excerpt:", error);
    throw error;
  }
};
