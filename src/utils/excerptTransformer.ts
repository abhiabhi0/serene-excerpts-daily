
import { v4 as uuidv4 } from 'uuid';
import { Book } from '@/types/excerpt';

export interface TransformedExcerpt {
  id: string;
  bookTitle: string;
  bookAuthor: string;
  translator: string;
  category: string;
  otherCategory: string;
  language: string;
  text: string;
  createdAt: string;
}

export const transformExcerpts = async (): Promise<TransformedExcerpt[]> => {
  try {
    console.log("Starting excerpt transformation...");
    const filesResponse = await fetch("/data/files.json");
    const files: string[] = await filesResponse.json();
    
    const transformedExcerpts: TransformedExcerpt[] = [];
    
    for (const file of files) {
      const bookResponse = await fetch(`/data/${file}`);
      const book: Book = await bookResponse.json();
      
      book.excerpts.forEach(excerpt => {
        transformedExcerpts.push({
          id: uuidv4(),
          bookTitle: book.metadata.title,
          bookAuthor: book.metadata.author || '',
          translator: book.metadata.translator || '',
          category: book.metadata.category || 'Spirituality',
          otherCategory: '',
          language: book.metadata.language || 'en',
          text: excerpt.text,
          createdAt: new Date().toISOString()
        });
      });
    }
    
    return transformedExcerpts;
  } catch (error) {
    console.error("Error transforming excerpts:", error);
    return [];
  }
};
