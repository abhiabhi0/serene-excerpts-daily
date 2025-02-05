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
  "Philosophy",
  "Spirituality",
  "Manifestation",
  "Self Help",
  "Other"
];

export const languages = [
  // Indian Languages
  { code: "hi", name: "Hindi" },
  { code: "bn", name: "Bengali" },
  { code: "te", name: "Telugu" },
  { code: "mr", name: "Marathi" },
  { code: "ta", name: "Tamil" },
  { code: "ur", name: "Urdu" },
  { code: "gu", name: "Gujarati" },
  { code: "kn", name: "Kannada" },
  { code: "ml", name: "Malayalam" },
  { code: "pa", name: "Punjabi" },
  { code: "sa", name: "Sanskrit" },
  
  // International Languages
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" }
];