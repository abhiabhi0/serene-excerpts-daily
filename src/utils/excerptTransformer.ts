  import { v4 as uuidv4 } from 'uuid';
  import { Book, FlattenedExcerpt } from '@/types/excerpt';

  export const transformBookToFlatExcerpts = (book: Book): FlattenedExcerpt[] => {
    console.log(`Transforming book: "${book.metadata.title}"`);
  
    // Log a sample excerpt from this book to check themes
    if (book.excerpts.length > 0) {
      const sampleExcerpt = book.excerpts[0];
      console.log('Sample excerpt themes from source:', sampleExcerpt.themes);
    }
  
    const flattenedExcerpts = book.excerpts.map(excerpt => {
      const result = {
        id: uuidv4(),
        bookTitle: book.metadata.title,
        bookAuthor: book.metadata.author || '',
        translator: book.metadata.translator || '',
        amazonLink: book.metadata.amazonLink || '',
        category: book.metadata.category || 'Spirituality',
        language: book.metadata.language || 'en',
        text: excerpt.text,
        themes: excerpt.themes || [], // Include themes with empty array fallback
        createdAt: new Date().toISOString()
      };
    
      return result;
    });
  
    console.log(`Transformed ${flattenedExcerpts.length} excerpts from book`);
  
    return flattenedExcerpts;
  };
  export const getRandomExcerptFromFlattened = (excerpts: FlattenedExcerpt[]): FlattenedExcerpt => {
    return excerpts[Math.floor(Math.random() * excerpts.length)];
  };
