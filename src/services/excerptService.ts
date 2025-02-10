
import { ExcerptWithMeta, FlattenedExcerpt } from "@/types/excerpt";
import { staticExcerpts } from "@/data/staticExcerpts";

const CACHE_VERSION = '2';
const CACHE_SIZE = 20;

interface ExcerptCache {
  version: string;
  excerpts: FlattenedExcerpt[];
  lastUpdated: number;
}

const getRandomExcerptsSubset = (excerpts: FlattenedExcerpt[], size: number = CACHE_SIZE): FlattenedExcerpt[] => {
  const shuffled = [...excerpts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, size);
};

const getCachedExcerpts = (): ExcerptCache | null => {
  try {
    const cached = localStorage.getItem('excerptCache');
    if (!cached) return null;
    
    const parsedCache: ExcerptCache = JSON.parse(cached);
    if (parsedCache.version !== CACHE_VERSION) return null;
    
    return parsedCache;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
};

const updateCache = async (excerpts: FlattenedExcerpt[]) => {
  const newCache: ExcerptCache = {
    version: CACHE_VERSION,
    excerpts: getRandomExcerptsSubset(excerpts),
    lastUpdated: Date.now()
  };

  try {
    localStorage.setItem('excerptCache', JSON.stringify(newCache));
    console.log("Cache updated with new excerpts");
  } catch (error) {
    console.error('Error updating cache:', error);
  }
};

const removeFromCache = (excerptId: string) => {
  const cache = getCachedExcerpts();
  if (!cache) return;

  const updatedExcerpts = cache.excerpts.filter(e => e.id !== excerptId);
  const newCache: ExcerptCache = {
    ...cache,
    excerpts: updatedExcerpts
  };

  localStorage.setItem('excerptCache', JSON.stringify(newCache));
  
  // If cache is running low, update it asynchronously
  if (updatedExcerpts.length <= 1) {
    console.log("Cache running low, updating in background...");
    setTimeout(() => updateCache(staticExcerpts), 0);
  }
};

const getRandomExcerptFromCache = async (
  languageFilter?: string[],
  bookFilter?: string[]
): Promise<FlattenedExcerpt> => {
  let cache = getCachedExcerpts();
  
  // If no cache exists or it's empty, create initial cache
  if (!cache || cache.excerpts.length === 0) {
    await updateCache(staticExcerpts);
    cache = getCachedExcerpts();
  }

  let availableExcerpts = cache?.excerpts || [];

  // Apply filters if provided
  if (languageFilter?.length || bookFilter?.length) {
    availableExcerpts = availableExcerpts.filter(excerpt => {
      const languageMatch = !languageFilter?.length || languageFilter.includes(excerpt.language);
      const bookMatch = !bookFilter?.length || bookFilter.includes(excerpt.bookTitle);
      return languageMatch && bookMatch;
    });

    // If no excerpts match filters, get new filtered set from static excerpts
    if (availableExcerpts.length === 0) {
      const filteredStaticExcerpts = staticExcerpts.filter(excerpt => {
        const languageMatch = !languageFilter?.length || languageFilter.includes(excerpt.language);
        const bookMatch = !bookFilter?.length || bookFilter.includes(excerpt.bookTitle);
        return languageMatch && bookMatch;
      });
      availableExcerpts = getRandomExcerptsSubset(filteredStaticExcerpts);
      await updateCache(filteredStaticExcerpts);
    }
  }

  const randomIndex = Math.floor(Math.random() * availableExcerpts.length);
  const selectedExcerpt = availableExcerpts[randomIndex];
  
  // Remove used excerpt from cache
  removeFromCache(selectedExcerpt.id);
  
  return selectedExcerpt;
};

export const getRandomExcerpt = async (): Promise<ExcerptWithMeta> => {
  const excerpt = await getRandomExcerptFromCache();
  return {
    text: excerpt.text,
    bookTitle: excerpt.bookTitle,
    bookAuthor: excerpt.bookAuthor,
    translator: excerpt.translator
  };
};
