
import { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';
import { transformBookToFlatExcerpts } from './excerptTransformer';
import type { Book, FlattenedExcerpt } from '../types/excerpt';

export function generateStaticExcerptsPlugin(): Plugin {
  return {
    name: 'generate-static-excerpts',
    buildStart: async () => {
      const dataDir = path.resolve(__dirname, '../../public/data');
      const outputDir = path.resolve(__dirname, '../data');
      
      // Ensure output directory exists
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Read all JSON files from data directory
      const files = fs.readdirSync(dataDir)
        .filter(file => file.endsWith('.json') && file !== 'files.json');

      const allBooks: Book[] = files.map(file => {
        const filePath = path.join(dataDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent);
      });

      // Transform books to flattened excerpts
      const staticExcerpts: FlattenedExcerpt[] = allBooks.flatMap(book => 
        transformBookToFlatExcerpts(book)
      );

      // Generate languages and books metadata
      const staticLanguages = Array.from(
        new Set(allBooks.map(book => book.metadata.language))
      ).sort();

      const staticBooks = allBooks.map(book => ({
        title: book.metadata.title,
        author: book.metadata.author,
        translator: book.metadata.translator,
        language: book.metadata.language,
        excerptCount: book.excerpts.length
      }));

      // Write generated data
      const outputPath = path.join(outputDir, 'generatedExcerpts.json');
      fs.writeFileSync(outputPath, JSON.stringify({
        excerpts: staticExcerpts,
        languages: staticLanguages,
        books: staticBooks
      }, null, 2));

      console.log(`Generated ${staticExcerpts.length} excerpts from ${files.length} books`);
    }
  };
}
