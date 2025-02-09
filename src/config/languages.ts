
export const languageCodes: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  sa: "Sanskrit"
};

export const getLanguageLabel = (code: string): string => {
  return languageCodes[code] || code;
};

export const getLanguageCode = (label: string): string => {
  const entry = Object.entries(languageCodes).find(([_, value]) => value === label);
  return entry ? entry[0] : label;
};

