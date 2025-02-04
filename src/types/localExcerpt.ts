export interface LocalExcerpt {
  id: string;
  bookTitle: string;
  category: string;
  language: string;
  text: string;
  createdAt: string;
}

export type Language = {
  code: string;
  name: string;
}

export const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'sa', name: 'Sanskrit' },
  { code: 'mr', name: 'Marathi' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'bn', name: 'Bengali' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' }
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