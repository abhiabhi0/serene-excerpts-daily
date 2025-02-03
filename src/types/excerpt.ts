export interface Book {
  metadata: {
    title: string;
    author: string;
    translator: string;
    amazonLink: string;
    tags: string[];
  };
  excerpts: Excerpt[];
}

export interface Excerpt {
  text: string;
  chapter?: string;
  verse?: string;
  commentary: boolean;
}

export interface ExcerptWithMeta extends Excerpt {
  bookTitle: string;
  bookAuthor: string;
  translator: string;
  amazonLink: string;
}