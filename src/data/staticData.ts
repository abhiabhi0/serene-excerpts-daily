
import { Book, FlattenedExcerpt } from "@/types/excerpt";
import { transformBookToFlatExcerpts } from '@/utils/excerptTransformer';

// Import all JSON files from the books directory at build time
const bookModules = import.meta.glob<Book>('./books/*.json', { eager: true });

// Convert the modules object to an array of books
const books: Book[] = Object.values(bookModules);

// Generate flattened excerpts at build time
export const staticExcerpts: FlattenedExcerpt[] = books.flatMap(transformBookToFlatExcerpts);

// Generate unique book titles
export const availableBooks: string[] = [...new Set(staticExcerpts.map(e => e.bookTitle))];

// Generate unique languages
export const availableLanguages: string[] = [...new Set(staticExcerpts.map(e => e.language))];

// Generate unique themes from all excerpts
export const availableThemes: string[] = [...new Set(
  books.flatMap(book => 
    book.excerpts.flatMap(excerpt => excerpt.themes || [])
  )
)].sort();

console.log('All Static Excerpts:', staticExcerpts);
console.log('All Books:', availableBooks);
console.log('All Languages:', availableLanguages);
console.log('All Themes:', availableThemes);
