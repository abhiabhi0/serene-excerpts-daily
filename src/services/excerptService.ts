
import { Book, ExcerptWithMeta } from "@/types/excerpt";

interface LanguagesAndBooks {
  languages: string[];
  books: Array<{
    title: string;
    language: string;
  }>;
}

export const getLanguagesAndBooks = async (): Promise<LanguagesAndBooks> => {
  const filesResponse = await fetch("/data/files.json");
  if (!filesResponse.ok) {
    throw new Error(`Failed to fetch files list: ${filesResponse.statusText}`);
  }
  
  const files: string[] = await filesResponse.json();
  const books: Array<{title: string; language: string}> = [];
  const languagesSet = new Set<string>();

  for (const file of files) {
    const bookResponse = await fetch(`/data/${file}`);
    if (bookResponse.ok) {
      const book: Book = await bookResponse.json();
      if (book.metadata.language) {
        languagesSet.add(book.metadata.language);
        books.push({
          title: book.metadata.title,
          language: book.metadata.language
        });
      }
    }
  }

  return {
    languages: Array.from(languagesSet),
    books
  };
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
    
    // Filter files based on selected languages and books
    if (selectedLanguages.length > 0 || selectedBooks.length > 0) {
      const validFiles = [];
      for (const file of files) {
        const bookResponse = await fetch(`/data/${file}`);
        if (bookResponse.ok) {
          const book: Book = await bookResponse.json();
          const languageMatch = selectedLanguages.length === 0 || selectedLanguages.includes(book.metadata.language || '');
          const bookMatch = selectedBooks.length === 0 || selectedBooks.includes(book.metadata.title);
          
          if (languageMatch && bookMatch) {
            validFiles.push(file);
          }
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
