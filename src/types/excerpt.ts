export interface Book {
  title: string;
  author: string;
  amazonLink: string;
  excerpts: Excerpt[];
}

export interface Excerpt {
  id: string;
  text: string;
  page?: number;
  chapter?: string;
}

export interface ExcerptWithMeta extends Excerpt {
  bookTitle: string;
  bookAuthor: string;
  amazonLink: string;
}