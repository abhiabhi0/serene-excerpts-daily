import { v4 as uuidv4 } from 'uuid';
import { Book, FlattenedExcerpt } from '@/types/excerpt';

export const transformBookToFlatExcerpts = (book: Book): FlattenedExcerpt[] => {
  return book.excerpts.map(excerpt => ({
    id: uuidv4(),
    bookTitle: book.metadata.title,
    bookAuthor:  '',
    translator:  '',
    amazonLink: book.metadata.amazonLink || '',
    category: book.metadata.category || 'Spirituality',
    language: book.metadata.language || 'en',
    text: excerpt.text,
    createdAt: new Date().toISOString()
  }));
};

export const getRandomExcerptFromFlattened = (excerpts: FlattenedExcerpt[]): FlattenedExcerpt => {
  return excerpts[Math.floor(Math.random() * excerpts.length)];
};
