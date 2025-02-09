
export interface ExcerptWithMeta {
  text: string;
  bookTitle?: string;
  bookAuthor?: string;
  translator?: string;
  amazonLink?: string;
  isLocal?: boolean;
}

export interface Book {
  metadata: {
    title: string;
    author?: string;
    translator?: string;
    amazonLink?: string;
    category?: string;
    tags?: string[];
    language?: string;  // Added language property
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
