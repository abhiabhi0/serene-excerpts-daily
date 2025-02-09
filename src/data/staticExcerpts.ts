
import type { FlattenedExcerpt } from "../types/excerpt";

// Use dynamic import for JSON
const generatedData = await import('./generatedExcerpts.json').then(module => module.default);

export const staticExcerpts: FlattenedExcerpt[] = generatedData.excerpts;
export const staticLanguages: string[] = generatedData.languages;
export const staticBooks = generatedData.books;
