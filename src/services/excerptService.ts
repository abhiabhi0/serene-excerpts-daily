
import { Book, ExcerptWithMeta } from "@/types/excerpt";

const updateFilesJson = async () => {
  try {
    // Get list of all JSON files in the data directory
    const response = await fetch('/data/');
    const files = await response.text();
    // Parse HTML response to get file list
    const parser = new DOMParser();
    const doc = parser.parseFromString(files, 'text/html');
    const jsonFiles = Array.from(doc.querySelectorAll('a'))
      .map(a => a.href)
      .filter(href => href.endsWith('.json'))
      .map(href => href.split('/').pop())
      .filter(file => file !== 'files.json');

    // Update files.json
    await fetch('/data/files.json', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonFiles, null, 2),
    });

    return jsonFiles;
  } catch (error) {
    console.error('Error updating files.json:', error);
    // Fallback to reading existing files.json
    const filesResponse = await fetch("/data/files.json");
    return await filesResponse.json();
  }
};

export const getRandomExcerpt = async (): Promise<ExcerptWithMeta> => {
  try {
    console.log("Fetching files list...");
    // First try to update files.json
    const files = await updateFilesJson();
    
    if (!files.length) {
      throw new Error("No excerpt files available");
    }
    
    const randomBookFile = files[Math.floor(Math.random() * files.length)];
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
