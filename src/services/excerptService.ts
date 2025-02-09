
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

const updateCache = async (excerpts: FlattenedExcerpt[]) => {
  // Update cache asynchronously to not block the main thread
  setTimeout(() => {
    try {
      localStorage.setItem('flattenedExcerpts', JSON.stringify(excerpts));
      localStorage.setItem('excerpts_version', CACHE_VERSION);
      console.log("Cache updated successfully in background");
    } catch (error) {
      console.error('Error updating cache:', error);
    }
  }, 0);
};

export const getRandomExcerpt = async (): Promise<ExcerptWithMeta> => {
  // Always get a random excerpt from static array first for immediate response
  const randomExcerpt = getRandomExcerptFromFlattened(staticExcerpts);
  
  // Check cache validity and update if needed in the background
  const cachedExcerpts = getCachedExcerpts();
  if (!cachedExcerpts) {
    updateCache(staticExcerpts);
  }
  
  return convertFlatToExcerptWithMeta(randomExcerpt);
};

