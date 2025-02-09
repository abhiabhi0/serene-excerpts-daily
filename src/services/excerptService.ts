
import { ExcerptWithMeta, FlattenedExcerpt } from "@/types/excerpt";
import { getRandomExcerptFromFlattened } from "@/utils/excerptTransformer";
import { staticExcerpts } from "@/data/staticExcerpts";

const convertFlatToExcerptWithMeta = (flat: FlattenedExcerpt): ExcerptWithMeta => ({
  text: flat.text,
  bookTitle: flat.bookTitle,
  bookAuthor: flat.bookAuthor,
  translator: flat.translator
});

// Add a version number to track cache freshness
const CACHE_VERSION = '1';

const isCacheValid = (): boolean => {
  const version = localStorage.getItem('excerpts_version');
  return version === CACHE_VERSION;
};

const getCachedExcerpts = (): FlattenedExcerpt[] | null => {
  try {
    if (!isCacheValid()) return null;
    const cached = localStorage.getItem('flattenedExcerpts');
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
};

const updateCache = (excerpts: FlattenedExcerpt[]) => {
  try {
    localStorage.setItem('flattenedExcerpts', JSON.stringify(excerpts));
    localStorage.setItem('excerpts_version', CACHE_VERSION);
  } catch (error) {
    console.error('Error updating cache:', error);
  }
};

export const getRandomExcerpt = async (): Promise<ExcerptWithMeta> => {
  // Use cached excerpts if available and valid
  const cachedExcerpts = getCachedExcerpts();
  
  // If cache is invalid or doesn't exist, use static excerpts and update cache
  const excerpts = cachedExcerpts || (() => {
    console.log("Updating cache with static excerpts");
    updateCache(staticExcerpts);
    return staticExcerpts;
  })();
  
  const randomExcerpt = getRandomExcerptFromFlattened(excerpts);
  return convertFlatToExcerptWithMeta(randomExcerpt);
};
