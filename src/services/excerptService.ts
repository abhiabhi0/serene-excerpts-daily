import { Book, ExcerptWithMeta } from "@/types/excerpt";

export const getRandomExcerpt = async (): Promise<ExcerptWithMeta> => {
  try {
    console.log("Fetching files list...");
    const filesResponse = await fetch("/atmanam-viddhi/data/files.json");
    if (!filesResponse.ok) {
      throw new Error(`Failed to fetch files list: ${filesResponse.statusText}`);
    }
    
    const files: string[] = await filesResponse.json();
    if (!files.length) {
      throw new Error("No excerpt files available");
    }
    
    const randomBookFile = files[Math.floor(Math.random() * files.length)];
    console.log("Selected book file:", randomBookFile);
    
    const bookResponse = await fetch(`/atmanam-viddhi/data/${randomBookFile}`);
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