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

export interface SocialExcerpt {
  id: string;
  created_at: string;
  user_id: string;
  book_title: string;
  category: string;
  language: string;
  text: string;
  book_author?: string;
  translator?: string;
  file_name: string;
}

export type Category = 'Spirituality' | 'Philosophy' | 'Religion' | 'Mythology' | 'Other';
export type Language = 'English' | 'Sanskrit' | 'Hindi' | 'Other';