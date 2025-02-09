
import { Book, ExcerptWithMeta } from "@/types/excerpt";

export const getRandomExcerpt = async (selectedBooks: string[] = []): Promise<ExcerptWithMeta> => {
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
    
    // Filter files based on selected books if any are selected
    const availableFiles = selectedBooks.length > 0
      ? files.filter(file => {
          const bookName = file.replace(".json", "").split("-").join(" ");
          return selectedBooks.includes(bookName);
        })
      : files;
    
    if (availableFiles.length === 0) {
      throw new Error("No books selected");
    }
    
    const randomBookFile = availableFiles[Math.floor(Math.random() * availableFiles.length)];
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
