
import { Book, FlattenedExcerpt } from "@/types/excerpt";
import isvaragita from './books/isvara-gita.json';
import pratyabhijandiram from './books/pratyabhijandiram.json';
import sriMaharshiWay from './books/sri-maharishi-way.json';
import tantrasara from './books/tantrasara.json';
import svetasvataraUpanishad from './books/svetasvatara-upanishad.json';
import stavacintamani from './books/stavacintamani.json';
import kathaUpanishad from './books/katha-upanishad.json';
import paramarthasaraAbhinavagupta from './books/paramarthasara-abhinavagupta.json';
import sriTantralok from './books/sri-tantralok.json';
import theVedantaPhilosophy from './books/the-vedanta-philosophy.json';
import shriShivaRahasya from './books/shri-shiva-rahasya.json';
import lallaVakyani from './books/lalla-vakyani.json';
import theBookOfSecrets from './books/the-book-of-secrets.json';
import sriDevikallotara from './books/sri-devikallotara.json';
import shivastotravali from './books/shivastotravali.json';
import shivDrasti from './books/shiv-drasti.json';
import spandaKarikas from './books/spanda-karikas.json';
import { transformBookToFlatExcerpts } from '@/utils/excerptTransformer';

// Import all books
const books: Book[] = [
  isvaragita,
  pratyabhijandiram,
  sriMaharshiWay,
  tantrasara,
  svetasvataraUpanishad,
  stavacintamani,
  kathaUpanishad,
  paramarthasaraAbhinavagupta,
  sriTantralok,
  theVedantaPhilosophy,
  shriShivaRahasya,
  lallaVakyani,
  theBookOfSecrets,
  sriDevikallotara,
  shivastotravali,
  shivDrasti,
  spandaKarikas
];

// Generate flattened excerpts at build time
export const staticExcerpts: FlattenedExcerpt[] = books.flatMap(transformBookToFlatExcerpts);

// Generate unique book titles
export const availableBooks: string[] = [...new Set(staticExcerpts.map(e => e.bookTitle))];

// Generate unique languages
export const availableLanguages: string[] = [...new Set(staticExcerpts.map(e => e.language))];
