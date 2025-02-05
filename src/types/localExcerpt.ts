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

export type Language = {
  code: string;
  name: string;
}

export const languages: Language[] = [
  // Indian Languages
  { code: 'hi', name: 'Hindi' },
  { code: 'sa', name: 'Sanskrit' },
  { code: 'mr', name: 'Marathi' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'bn', name: 'Bengali' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'ur', name: 'Urdu' },
  // International Languages
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' }
];

export const categories = [
  'Spirituality',
  'Philosophy',
  'Meditation',
  'Yoga',
  'Vedanta',
  'Tantra',
  'Buddhism',
  'Hinduism',
  'Other'
] as const;