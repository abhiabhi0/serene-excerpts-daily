
import { FlattenedExcerpt } from "@/types/excerpt";
import { Book } from "@/types/excerpt";
import { transformBookToFlatExcerpts } from "@/utils/excerptTransformer";
import files from "../../public/data/files.json";

class ExcerptStore {
  private static instance: ExcerptStore;
  private _excerpts: FlattenedExcerpt[] = [];
  private _languages: string[] = [];
  private _books: {
    title: string;
    author: string | undefined;
    translator: string | undefined;
    language: string;
    excerptCount: number;
  }[] = [];
  private _isInitialized = false;

  private constructor() {}

  static getInstance(): ExcerptStore {
    if (!ExcerptStore.instance) {
      ExcerptStore.instance = new ExcerptStore();
    }
    return ExcerptStore.instance;
  }

  async initialize() {
    if (this._isInitialized) return;

    try {
      const books: Book[] = [];
      
      for (const file of files) {
        try {
          console.log(`Attempting to import ${file}...`);
          const bookModule = await import(`../../public/data/${file}`);
          if (bookModule && bookModule.default) {
            books.push(bookModule.default);
            console.log(`Successfully imported ${file}`);
          } else {
            console.error(`Invalid module format for ${file}`);
          }
        } catch (error) {
          console.error(`Error importing ${file}:`, error);
        }
      }

      console.log(`Imported ${books.length} books successfully`);
      
      if (books.length === 0) {
        console.error("No books were imported successfully");
        return;
      }

      this._excerpts = books.flatMap(book => transformBookToFlatExcerpts(book));
      this._languages = Array.from(new Set(books.map(book => book.metadata.language))).sort();
      this._books = books.map(book => ({
        title: book.metadata.title,
        author: book.metadata.author,
        translator: book.metadata.translator,
        language: book.metadata.language,
        excerptCount: book.excerpts.length
      }));

      console.log('All Static Excerpts:', this._excerpts);
      console.log('All Languages:', this._languages);
      console.log('All Books:', this._books);

      this._isInitialized = true;
    } catch (error) {
      console.error("Error initializing excerpt store:", error);
      throw error;
    }
  }

  get excerpts(): FlattenedExcerpt[] {
    return this._excerpts;
  }

  get languages(): string[] {
    return this._languages;
  }

  get books(): {
    title: string;
    author: string | undefined;
    translator: string | undefined;
    language: string;
    excerptCount: number;
  }[] {
    return this._books;
  }
}

export const excerptStore = ExcerptStore.getInstance();

