
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
      // If cache is older than 1 hour or content is different, update it
      if (cacheAge > 3600000 || JSON.stringify(parsedCache.excerpts) !== JSON.stringify(staticExcerpts)) {
        console.log("Updating cache from static excerpts");
        flattenedExcerpts = syncExcerptsWithCache(staticExcerpts);
      } else {
        console.log("Using cached flattened excerpts");
        flattenedExcerpts = parsedCache.excerpts;
      }
    } else {
      // If no cache exists, use static excerpts and create cache
      console.log("Using static excerpts and creating cache");
      flattenedExcerpts = syncExcerptsWithCache(staticExcerpts);
    }

    const randomExcerpt = getRandomExcerptFromFlattened(flattenedExcerpts);
    return convertFlatToExcerptWithMeta(randomExcerpt);
  } catch (error) {
    console.error("Error fetching excerpt:", error);
    throw error;
  }
};
