
import { ExcerptWithMeta, FlattenedExcerpt } from "@/types/excerpt";
import { getRandomExcerptFromFlattened } from "@/utils/excerptTransformer";
import { staticExcerpts } from "@/data/staticExcerpts";

const EXCERPTS_CACHE_KEY = 'flattenedExcerpts';

const convertFlatToExcerptWithMeta = (flat: FlattenedExcerpt): ExcerptWithMeta => ({
  text: flat.text,
  bookTitle: flat.bookTitle,
  bookAuthor: flat.bookAuthor,
  translator: flat.translator
});

const syncExcerptsWithCache = (excerpts: FlattenedExcerpt[]) => {
  localStorage.setItem(EXCERPTS_CACHE_KEY, JSON.stringify(excerpts));
  return excerpts;
};

export const getRandomExcerpt = async (): Promise<ExcerptWithMeta> => {
  try {
    // Try to get from cache first
    const cached = localStorage.getItem(EXCERPTS_CACHE_KEY);
    let flattenedExcerpts: FlattenedExcerpt[];

    if (cached) {
      console.log("Using cached excerpts");
      flattenedExcerpts = JSON.parse(cached);
    } else {
      console.log("Cache missing - using static excerpts");
      flattenedExcerpts = syncExcerptsWithCache(staticExcerpts);
    }

    const randomExcerpt = getRandomExcerptFromFlattened(flattenedExcerpts);
    return convertFlatToExcerptWithMeta(randomExcerpt);
  } catch (error) {
    console.error("Error fetching excerpt:", error);
    throw error;
  }
};
