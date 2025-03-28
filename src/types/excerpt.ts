export interface ExcerptWithMeta {
  text: string;
  bookTitle?: string;
  bookAuthor?: string;
  translator?: string;
  amazonLink?: string;
  isLocal?: boolean;
  isFavorite?: boolean;
  id?: string;
  themes?: string[];
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
    themes?: string[];
  }[];
}

export interface ExcerptCardProps {
  excerpt: ExcerptWithMeta;
  onNewExcerpt: () => void;
  onScreenshotModeChange?: (mode: boolean) => void;
}

export interface FlattenedExcerpt {
  id: string;
  text: string;
  chapter?: string;
  verse?: string;
  commentary?: boolean;
  themes?: string[];
  metadata: {
    title: string;
    author?: string;
    translator?: string;
    amazonLink?: string;
    category?: string;
    language?: string;
    tags?: string[];
    sourceFile: string;
  };
}
