
import generatedData from './generatedExcerpts.json';
import { FlattenedExcerpt } from "@/types/excerpt";

export const staticExcerpts: FlattenedExcerpt[] = generatedData.excerpts;
export const staticLanguages: string[] = generatedData.languages;
export const staticBooks = generatedData.books;
