export interface ExcerptWithMeta {
  text: string;
  bookTitle?: string;
  bookAuthor?: string;
  translator?: string;
  amazonLink?: string;
  isLocal?: boolean;
  isFavorite?: boolean;
  id?: string; // To track favorites
}

export interface Book {
  metadata: {
    title: string;
    author?: string;
    translator?: string;
    amazonLink?: string;
    category?: string;
    language?: string;
    tags?: string[];
  };
  excerpts: {
    text: string;
    chapter?: string;
    verse?: string;
    commentary?: boolean;
  }[];
}

export interface ExcerptCardProps {
  excerpt: ExcerptWithMeta;
  onNewExcerpt: () => void;
  onScreenshotModeChange?: (mode: boolean) => void;
}

export interface FlattenedExcerpt {
  id: string;
  bookTitle: string;
  bookAuthor?: string;
  translator?: string;
  category: string;
  otherCategory?: string;
  language: string;
  text: string;
  createdAt: string;
  amazonLink?: string;
}
