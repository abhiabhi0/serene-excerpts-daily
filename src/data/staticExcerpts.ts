import { Book, FlattenedExcerpt } from '@/types/excerpt';
import { transformBookToFlatExcerpts } from "@/utils/excerptTransformer";

const dataDir = '/data';
const filesJsonPath = `${dataDir}/files.json`;

console.log('Data Directory:', dataDir);
console.log('Files JSON Path:', filesJsonPath);

// Function to fetch JSON files
async function fetchJson(filePath: string): Promise<any> {
  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${filePath}: ${response.statusText}`);
  }
  return response.json();
}

// Define variables to hold the data
let staticExcerpts: FlattenedExcerpt[] = [];
let staticLanguages: string[] = [];
let staticBooks: { title: string; author: string; translator: string; language: string; excerptCount: number }[] = [];

// Fetch the list of JSON files
async function fetchFiles() {
  try {
    const files: string[] = await fetchJson(filesJsonPath);
    console.log('Files:', files);

    // Fetch all book JSON files
    const allBooks: Book[] = await Promise.all(
      files.map(file => fetchJson(`${dataDir}/${file}`))
    );

    console.log('All Books:', allBooks);

    // Transform books to flattened excerpts
    staticExcerpts = allBooks.flatMap(book => 
      transformBookToFlatExcerpts(book)
    );

    // Create array of unique languages from books
    staticLanguages = Array.from(
      new Set(allBooks.map((book: Book) => book.metadata.language as string))
    ).sort();

    // Create array of book titles and their metadata
    staticBooks = allBooks.map(book => ({
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
  } catch (error) {
    console.error('Error fetching files:', error);
  }
}

// Call the fetchFiles function to initialize data
fetchFiles();

export { staticExcerpts, staticLanguages, staticBooks };
