
import { ExcerptWithMeta, FlattenedExcerpt } from "@/types/excerpt";
import { createFlattenedExcerpts, getRandomExcerptFromFlattened } from "@/utils/excerptTransformer";
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

export const getRandomExcerpt = async (): Promise<ExcerptWithMeta> => {
  try {
    // Log the static excerpts to see the array
    console.log("Static Excerpts Array:", staticExcerpts);
    
    // Try to get from localStorage first
    const cached = localStorage.getItem('flattenedExcerpts');
    let flattenedExcerpts: FlattenedExcerpt[];

    if (cached) {
      const parsedCache = JSON.parse(cached);
      
      // If static excerpts are available and different from cache, update cache
      if (staticExcerpts.length > 0 && JSON.stringify(parsedCache) !== JSON.stringify(staticExcerpts)) {
        console.log("Updating cache from static excerpts");
        flattenedExcerpts = syncExcerptsWithCache(staticExcerpts);
      } else {
        console.log("Using cached flattened excerpts");
        flattenedExcerpts = parsedCache;
      }
    } else if (staticExcerpts.length > 0) {
      // If no cache but static excerpts exist, use those
      console.log("Using static excerpts and updating cache");
      flattenedExcerpts = syncExcerptsWithCache(staticExcerpts);
    } else {
      // If neither cache nor static excerpts exist, create new ones
      console.log("Creating new flattened excerpts");
      flattenedExcerpts = await createFlattenedExcerpts();
      syncExcerptsWithCache(flattenedExcerpts);
    }

    const randomExcerpt = getRandomExcerptFromFlattened(flattenedExcerpts);
    return convertFlatToExcerptWithMeta(randomExcerpt);
  } catch (error) {
    console.error("Error fetching excerpt:", error);
    throw error;
  }
};
