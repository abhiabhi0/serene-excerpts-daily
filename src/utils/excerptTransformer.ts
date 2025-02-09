
import { v4 as uuidv4 } from 'uuid';
import { Book } from '@/types/excerpt';

export interface TransformedExcerpt {
  id: string;
  bookTitle: string;
  bookAuthor?: string;
  translator?: string;
  category: string;
  otherCategory?: string;
  language: string;
  text: string;
  createdAt: string;
}

export const transformBookToExcerpts = async (): Promise<TransformedExcerpt[]> => {
  try {
    console.log("Starting excerpt transformation...");
    const filesResponse = await fetch("/data/files.json");
    const files: string[] = await filesResponse.json();
    
    const allExcerpts: TransformedExcerpt[] = [];
    
    for (const file of files) {
      const bookResponse = await fetch(`/data/${file}`);
      const book: Book = await bookResponse.json();
      
      // Transform each excerpt from the book
      const bookExcerpts = book.excerpts.map(excerpt => ({
        id: uuidv4(),
        bookTitle: book.metadata.title,
        bookAuthor: book.metadata.author || undefined,
        translator: book.metadata.translator,
        category: book.metadata.category || "Spirituality",
        otherCategory: "",
        language: book.metadata.language || "en",
        text: excerpt.text,
        createdAt: new Date().toISOString()
      }));
      
      allExcerpts.push(...bookExcerpts);
    }
    
    // Shuffle the array
    const shuffledExcerpts = allExcerpts.sort(() => Math.random() - 0.5);
    
    console.log(`Transformed ${shuffledExcerpts.length} excerpts`);
    return shuffledExcerpts;
    
  } catch (error) {
    console.error("Error transforming excerpts:", error);
    throw error;
  }
};
