export interface LocalExcerpt {
  id: string;
  bookTitle: string;
  bookAuthor?: string;
  translator?: string;
  category: string;
  otherCategory?: string;
  language: string;
  text: string;
  createdAt: string;
}

export const categories = [
  "Poetry",
  "Prose",
  "Philosophy",
  "Spirituality",
  "Other"
];

export const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "sa", name: "Sanskrit" },
  { code: "mr", name: "Marathi" }
];