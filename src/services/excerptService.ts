
import { ExcerptWithMeta, FlattenedExcerpt } from "@/types/excerpt";
import { getRandomExcerptFromFlattened } from "@/utils/excerptTransformer";
import { excerptStore } from "@/data/staticExcerpts";

const convertFlatToExcerptWithMeta = (flat: FlattenedExcerpt): ExcerptWithMeta => ({
  text: flat.text,
  bookTitle: flat.bookTitle,
  bookAuthor: flat.bookAuthor,
  translator: flat.translator
});

const syncExcerptsWithCache = (excerpts: FlattenedExcerpt[]) => {
  const cacheData = {
    excerpts,
    timestamp: new Date().getTime()
  };
  localStorage.setItem('flattenedExcerpts', JSON.stringify(cacheData));
  return excerpts;
};

export const getRandomExcerpt = async (): Promise<ExcerptWithMeta> => {
  try {
    // Initialize excerpt store if not already initialized
    await excerptStore.initialize();
    
    const staticExcerpts = excerptStore.excerpts;
    console.log("Static Excerpts Array:", staticExcerpts);
    
    // Try to get from localStorage first
    const cached = localStorage.getItem('flattenedExcerpts');
    let flattenedExcerpts: FlattenedExcerpt[];

    if (cached) {
      const parsedCache = JSON.parse(cached);
      const cacheAge = new Date().getTime() - parsedCache.timestamp;
      
      if (!parsedCache.excerpts || !Array.isArray(parsedCache.excerpts) || parsedCache.excerpts.length === 0) {
        localStorage.removeItem('flattenedExcerpts');
        console.log("Cleared invalid cache");
      }
      else if (cacheAge > 3600000 || JSON.stringify(parsedCache.excerpts) !== JSON.stringify(staticExcerpts)) {
        console.log("Updating cache from static excerpts");
        flattenedExcerpts = syncExcerptsWithCache(staticExcerpts);
      } else {
        console.log("Using cached flattened excerpts");
        flattenedExcerpts = parsedCache.excerpts;
      }
    }

    if (!flattenedExcerpts || flattenedExcerpts.length === 0) {
      console.log("Using static excerpts and creating new cache");
      if (!staticExcerpts || staticExcerpts.length === 0) {
        throw new Error("No excerpts available");
      }
      flattenedExcerpts = syncExcerptsWithCache(staticExcerpts);
    }

    const randomExcerpt = getRandomExcerptFromFlattened(flattenedExcerpts);
    if (!randomExcerpt) {
      throw new Error("No excerpts available");
    }
    
    return convertFlatToExcerptWithMeta(randomExcerpt);
  } catch (error) {
    console.error("Error fetching excerpt:", error);
    throw error;
  }
};

