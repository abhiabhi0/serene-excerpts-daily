
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
  // Add timestamp to cache to detect staleness
  const cacheData = {
    excerpts,
    timestamp: new Date().getTime()
  };
  localStorage.setItem('flattenedExcerpts', JSON.stringify(cacheData));
  return excerpts;
};

export const getRandomExcerpt = async (): Promise<ExcerptWithMeta> => {
  try {
    // Log the static excerpts to see the array
    console.log("Static Excerpts Array:", staticExcerpts);
    
    // Try to get from localStorage first
    const cached = localStorage.getItem('flattenedExcerpts');
    let flattenedExcerpts: FlattenedExcerpt[];

    if (cached) {
      const parsedCache = JSON.parse(cached);
      const cacheAge = new Date().getTime() - parsedCache.timestamp;
      
      // Clear cache if it's empty or invalid
      if (!parsedCache.excerpts || !Array.isArray(parsedCache.excerpts) || parsedCache.excerpts.length === 0) {
        localStorage.removeItem('flattenedExcerpts');
        console.log("Cleared invalid cache");
      }
      // If cache is older than 1 hour or content is different, update it
      else if (cacheAge > 3600000 || JSON.stringify(parsedCache.excerpts) !== JSON.stringify(staticExcerpts)) {
        console.log("Updating cache from static excerpts");
        flattenedExcerpts = syncExcerptsWithCache(staticExcerpts);
      } else {
        console.log("Using cached flattened excerpts");
        flattenedExcerpts = parsedCache.excerpts;
      }
    }

    // If no valid cache exists or static excerpts are available, use static excerpts
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
