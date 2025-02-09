
import generatedData from './generatedExcerpts.json' assert { type: 'json' };
import type { FlattenedExcerpt } from "../types/excerpt";

export const staticExcerpts: FlattenedExcerpt[] = generatedData.excerpts;
export const staticLanguages: string[] = generatedData.languages;
export const staticBooks = generatedData.books;
