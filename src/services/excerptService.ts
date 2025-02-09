
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
export const getAvailableLanguages = (): string[] => {
  const languages = new Set(staticExcerpts.map(excerpt => excerpt.language));
  return Array.from(languages);
};

export const getRandomExcerpt = async (selectedLanguages?: string[]): Promise<ExcerptWithMeta> => {
  try {
    console.log("Selected Languages:", selectedLanguages);
    
    // Try to get from localStorage first
    const cached = localStorage.getItem('flattenedExcerpts');
    let flattenedExcerpts: FlattenedExcerpt[];

    if (cached) {
      const parsedCache = JSON.parse(cached);
      // If cache is outdated, update it with static excerpts
      if (JSON.stringify(parsedCache) !== JSON.stringify(staticExcerpts)) {
        console.log("Updating cache from static excerpts");
        flattenedExcerpts = syncExcerptsWithCache(staticExcerpts);
      } else {
        console.log("Using cached flattened excerpts");
        flattenedExcerpts = parsedCache;
      }
    } else {
      // If no cache exists, use static excerpts and create cache
      console.log("Using static excerpts and creating cache");
      flattenedExcerpts = syncExcerptsWithCache(staticExcerpts);
    }

    // Filter excerpts by selected languages if any are selected
    const filteredExcerpts = selectedLanguages && selectedLanguages.length > 0
      ? flattenedExcerpts.filter(excerpt => selectedLanguages.includes(excerpt.language))
      : flattenedExcerpts;

    console.log("Filtered Excerpts Count:", filteredExcerpts.length);
    
    if (filteredExcerpts.length === 0) {
      // If no excerpts match the language filter, use all excerpts
      const randomExcerpt = getRandomExcerptFromFlattened(flattenedExcerpts);
      return convertFlatToExcerptWithMeta(randomExcerpt);
    }

    const randomExcerpt = getRandomExcerptFromFlattened(filteredExcerpts);
    return convertFlatToExcerptWithMeta(randomExcerpt);
  } catch (error) {
    console.error("Error fetching excerpt:", error);
    throw error;
  }
};
