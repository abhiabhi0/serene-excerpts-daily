export interface ExcerptWithMeta {
  text: string;
  bookTitle?: string;
  bookAuthor?: string;
  translator?: string;
  amazonLink?: string;
  isLocal?: boolean;
}