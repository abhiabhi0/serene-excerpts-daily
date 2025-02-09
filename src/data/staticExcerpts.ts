
import { FlattenedExcerpt } from "@/types/excerpt";
import { Book } from "@/types/excerpt";
import { transformBookToFlatExcerpts } from "@/utils/excerptTransformer";

// Import all JSON files
import amritanubhava from "../../public/data/amritanubhava.json";
import bhavopahara from "../../public/data/bhavopahara.json";
import changadevPasashti from "../../public/data/changadev-pasashti.json";
import cwSriRamanaMaharishi from "../../public/data/cw-sri-ramana-maharishi.json";
import drgDrsaViveka from "../../public/data/drg-drsa-viveka.json";
import gitarthaSamgraha from "../../public/data/gitartha-samgraha-abhinavagupta.json";
import gyanganj from "../../public/data/gyanganj.json";
import isvaraGita from "../../public/data/isvara-gita.json";
import laghuYogaVasishta from "../../public/data/laghu-yoga-vasishta.json";
import lallaVakyani from "../../public/data/lalla-vakyani.json";
import paramarthasara from "../../public/data/paramarthasara-abhinavagupta.json";
import patanjaliYogaSutras from "../../public/data/patanjali-yoga-sutras-sv.json";
import pratyabhijandiram from "../../public/data/pratyabhijandiram.json";
import shivDrasti from "../../public/data/shiv-drasti.json";
import shivastotravali from "../../public/data/shivastotravali.json";
import shriShivaRahasya from "../../public/data/shri-shiva-rahasya.json";
import spandaKarikas from "../../public/data/spanda-karikas.json";
import sriDevikallotara from "../../public/data/sri-devikallotara.json";
import sriMaharishiWay from "../../public/data/sri-maharishi-way.json";
import stavacintamani from "../../public/data/stavacintamani.json";
import tantrasara from "../../public/data/tantrasara.json";
import theBookOfSecrets from "../../public/data/the-book-of-secrets.json";
import theVedantaPhilosophy from "../../public/data/the-vedanta-philosophy.json";

const allBooks: Book[] = [
  amritanubhava,
  bhavopahara,
  changadevPasashti,
  cwSriRamanaMaharishi,
  drgDrsaViveka,
  gitarthaSamgraha,
  gyanganj,
  isvaraGita,
  laghuYogaVasishta,
  lallaVakyani,
  paramarthasara,
  patanjaliYogaSutras,
  pratyabhijandiram,
  shivDrasti,
  shivastotravali,
  shriShivaRahasya,
  spandaKarikas,
  sriDevikallotara,
  sriMaharishiWay,
  stavacintamani,
  tantrasara,
  theBookOfSecrets,
  theVedantaPhilosophy
];

export const staticExcerpts: FlattenedExcerpt[] = allBooks.flatMap(book => 
  transformBookToFlatExcerpts(book)
);

// Create array of unique languages from books
export const staticLanguages: string[] = Array.from(
  new Set(allBooks.map(book => book.metadata.language))
).sort();

// Create array of book titles and their metadata
export const staticBooks = allBooks.map(book => ({
  title: book.metadata.title,
  author: book.metadata.author,
  translator: book.metadata.translator,
  language: book.metadata.language,
  excerptCount: book.excerpts.length
}));

// Log all static data
console.log('All Static Excerpts:', staticExcerpts);
console.log('All Languages:', staticLanguages);
console.log('All Books:', staticBooks);

