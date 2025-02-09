
import { ExcerptWithMeta, FlattenedExcerpt } from "@/types/excerpt";
import { getRandomExcerptFromFlattened } from "@/utils/excerptTransformer";
import { staticExcerpts } from "@/data/staticExcerpts";

const convertFlatToExcerptWithMeta = (flat: FlattenedExcerpt): ExcerptWithMeta => ({
  text: flat.text,
  bookTitle: flat.bookTitle,
  bookAuthor: flat.bookAuthor,
  translator: flat.translator
});

const syncExcerptsWithCache = (excerpts: FlattenedExcerpt[]) => {
  localStorage.setItem('flattenedExcerpts', JSON.stringify(excerpts));
  return excerpts;
};

// Get unique languages from excerpts
const getAvailableLanguages = (excerpts: FlattenedExcerpt[]): string[] => {
  if (!excerpts || excerpts.length === 0) {
    return [];
  }
  
  const uniqueLanguages = new Set(
    excerpts
      .filter(excerpt => excerpt && excerpt.language)
      .map(excerpt => excerpt.language)
  );
  return Array.from(uniqueLanguages).sort();
};

export const getRandomExcerpt = async (selectedLanguages?: string[]): Promise<ExcerptWithMeta> => {
  try {
    // Try to get from localStorage first
    const cached = localStorage.getItem('flattenedExcerpts');
    let flattenedExcerpts: FlattenedExcerpt[];

    if (cached) {
      const parsedCache = JSON.parse(cached);
      // If cache is outdated, update it with static excerpts
      if (JSON.stringify(parsedCache) !== JSON.stringify(staticExcerpts)) {
        flattenedExcerpts = syncExcerptsWithCache(staticExcerpts);
      } else {
        flattenedExcerpts = parsedCache;
      }
    } else {
      // If no cache exists, use static excerpts and create cache
      flattenedExcerpts = syncExcerptsWithCache(staticExcerpts);
    }

    // Filter excerpts by selected languages if provided
    const filteredExcerpts = selectedLanguages?.length 
      ? flattenedExcerpts.filter(excerpt => selectedLanguages.includes(excerpt.language))
      : flattenedExcerpts;

    const randomExcerpt = getRandomExcerptFromFlattened(filteredExcerpts);
    return convertFlatToExcerptWithMeta(randomExcerpt);
  } catch (error) {
    console.error("Error fetching excerpt:", error);
    throw error;
  }
};

export const getAllLanguages = (): string[] => {
  return getAvailableLanguages(staticExcerpts);
};
