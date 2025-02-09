
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
  private _initializationPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): ExcerptStore {
    if (!ExcerptStore.instance) {
      ExcerptStore.instance = new ExcerptStore();
    }
    return ExcerptStore.instance;
  }

  async initialize() {
    // If already initialized, return immediately
    if (this._isInitialized) {
      console.log("ExcerptStore already initialized");
      return;
    }

    // If initialization is in progress, wait for it
    if (this._initializationPromise) {
      console.log("ExcerptStore initialization in progress, waiting...");
      return this._initializationPromise;
    }

    console.log("Starting ExcerptStore initialization");
    this._initializationPromise = this._initialize();
    await this._initializationPromise;
    this._initializationPromise = null;
  }

  private async _initialize() {
    try {
      console.log("Loading books from files.json:", files);
      const books: Book[] = [];
      
      for (const file of files) {
        try {
          console.log(`Importing ${file}...`);
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
        throw new Error("Failed to import any books");
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

      console.log(`Processed ${this._excerpts.length} excerpts`);
      console.log(`Found ${this._languages.length} languages`);
      console.log(`Processed ${this._books.length} books`);

      this._isInitialized = true;
    } catch (error) {
      console.error("Error in ExcerptStore initialization:", error);
      this._isInitialized = false;
      throw error;
    }
  }

  get excerpts(): FlattenedExcerpt[] {
    if (!this._isInitialized) {
      console.warn("Attempting to access excerpts before initialization");
      return [];
    }
    return this._excerpts;
  }

  get languages(): string[] {
    if (!this._isInitialized) {
      console.warn("Attempting to access languages before initialization");
      return [];
    }
    return this._languages;
  }

  get books(): {
    title: string;
    author: string | undefined;
    translator: string | undefined;
    language: string;
    excerptCount: number;
  }[] {
    if (!this._isInitialized) {
      console.warn("Attempting to access books before initialization");
      return [];
    }
    return this._books;
  }
}

export const excerptStore = ExcerptStore.getInstance();
