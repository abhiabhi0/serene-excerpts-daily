
import { Book, FlattenedExcerpt } from "@/types/excerpt";
import amritanubhava from './books/amritanubhava.json';
import ashtavakraSamhita from './books/ashtavakra-samhita.json';
import bhavopahara from './books/bhavopahara.json';
import changadevPasashti from './books/changadev-pasashti.json';
import cwSriRamanaMaharishi from './books/cw-sri-ramana-maharishi.json';
import drgDrsaViveka from './books/drg-drsa-viveka.json';
import gitarthaSamgraha from './books/gitartha-samgraha-abhinavagupta.json';
import { transformBookToFlatExcerpts } from '@/utils/excerptTransformer';

// Import all books
const books: Book[] = [
  amritanubhava,
  ashtavakraSamhita,
  bhavopahara,
  changadevPasashti,
  cwSriRamanaMaharishi,
  drgDrsaViveka,
  gitarthaSamgraha,
];

// Generate flattened excerpts at build time
export const staticExcerpts: FlattenedExcerpt[] = books.flatMap(transformBookToFlatExcerpts);

// Generate unique book titles
export const availableBooks: string[] = [...new Set(staticExcerpts.map(e => e.bookTitle))];

// Generate unique languages
export const availableLanguages: string[] = [...new Set(staticExcerpts.map(e => e.language))];
