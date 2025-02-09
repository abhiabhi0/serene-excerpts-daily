
import { v4 as uuidv4 } from 'uuid';
import { Book, FlattenedExcerpt } from '@/types/excerpt';

export const transformBookToFlatExcerpts = (book: Book): FlattenedExcerpt[] => {
  return book.excerpts.map(excerpt => ({
    id: uuidv4(),
    bookTitle: book.metadata.title,
    bookAuthor: book.metadata.author || undefined,
    translator: book.metadata.translator,
    category: book.metadata.category || 'Spirituality',
    language: 'en', // Default to English
    text: excerpt.text,
    createdAt: new Date().toISOString()
  }));
};

export const createFlattenedExcerpts = async (): Promise<FlattenedExcerpt[]> => {
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

    const allExcerpts: FlattenedExcerpt[] = [];
    
    // Fetch and process all book files
    for (const file of files) {
      const bookResponse = await fetch(`/data/${file}`);
      if (!bookResponse.ok) continue;
      
      const book: Book = await bookResponse.json();
      const flatExcerpts = transformBookToFlatExcerpts(book);
      allExcerpts.push(...flatExcerpts);
    }

    // Save to localStorage
    localStorage.setItem('flattenedExcerpts', JSON.stringify(allExcerpts));
    return allExcerpts;
  } catch (error) {
    console.error("Error creating flattened excerpts:", error);
    throw error;
  }
};

export const getRandomExcerptFromFlattened = (excerpts: FlattenedExcerpt[]): FlattenedExcerpt => {
  return excerpts[Math.floor(Math.random() * excerpts.length)];
};
