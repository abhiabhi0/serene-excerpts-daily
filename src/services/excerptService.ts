
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
  if (!excerpts || excerpts.length === 0) {
    console.error("Attempted to cache empty excerpts array");
    return excerpts;
  }
  
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
    console.log("Initializing excerpt store...");
    await excerptStore.initialize();
    
    const staticExcerpts = excerptStore.excerpts;
    console.log(`Loaded ${staticExcerpts?.length || 0} static excerpts`);
    
    if (!staticExcerpts || staticExcerpts.length === 0) {
      console.error("No static excerpts were loaded");
      throw new Error("No excerpts available");
    }

    // Try to get from localStorage first
    let flattenedExcerpts: FlattenedExcerpt[] | null = null;
    const cached = localStorage.getItem('flattenedExcerpts');

    if (cached) {
      try {
        const parsedCache = JSON.parse(cached);
        console.log("Found cached excerpts:", parsedCache);
        
        if (!parsedCache.excerpts || !Array.isArray(parsedCache.excerpts) || parsedCache.excerpts.length === 0) {
          console.log("Invalid cache format, clearing cache");
          localStorage.removeItem('flattenedExcerpts');
        } else {
          const cacheAge = new Date().getTime() - parsedCache.timestamp;
          if (cacheAge > 3600000 || JSON.stringify(parsedCache.excerpts) !== JSON.stringify(staticExcerpts)) {
            console.log("Cache expired or content changed, updating cache");
            flattenedExcerpts = syncExcerptsWithCache(staticExcerpts);
          } else {
            console.log("Using valid cached excerpts");
            flattenedExcerpts = parsedCache.excerpts;
          }
        }
      } catch (error) {
        console.error("Error parsing cache:", error);
        localStorage.removeItem('flattenedExcerpts');
      }
    }

    if (!flattenedExcerpts || flattenedExcerpts.length === 0) {
      console.log("No valid cache found, using static excerpts");
      flattenedExcerpts = syncExcerptsWithCache(staticExcerpts);
    }

    const randomExcerpt = getRandomExcerptFromFlattened(flattenedExcerpts);
    if (!randomExcerpt) {
      console.error("Failed to get random excerpt from", flattenedExcerpts);
      throw new Error("No excerpts available");
    }
    
    console.log("Successfully selected random excerpt:", randomExcerpt);
    return convertFlatToExcerptWithMeta(randomExcerpt);
  } catch (error) {
    console.error("Error in getRandomExcerpt:", error);
    throw error;
  }
};
