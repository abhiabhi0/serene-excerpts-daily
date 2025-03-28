import { FlattenedExcerpt } from "@/types/excerpt";

// Import the pre-generated static excerpts
import staticExcerptsJson from './staticExcerpts.json';

// Export the static excerpts
export const staticExcerpts: FlattenedExcerpt[] = staticExcerptsJson;

// Generate unique book titles
export const availableBooks: string[] = [...new Set(staticExcerpts.map(e => e.bookTitle))];

// Generate unique languages
export const availableLanguages: string[] = [...new Set(staticExcerpts.map(e => e.language))];

// Generate unique themes from all excerpts
export const availableThemes: string[] = [...new Set(
  staticExcerpts.flatMap(e => e.themes || [])
)].sort();

console.log('Loaded Static Excerpts:', staticExcerpts.length);
