
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

// Get all unique languages from static excerpts
export const getAllLanguages = (): string[] => {
  const languages = new Set<string>();
  staticExcerpts.forEach(excerpt => {
    if (excerpt.language) {
      languages.add(excerpt.language);
    }
  });
  return Array.from(languages);
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

    const randomExcerpt = getRandomExcerptFromFlattened(flattenedExcerpts);
    return convertFlatToExcerptWithMeta(randomExcerpt);
  } catch (error) {
    console.error("Error fetching excerpt:", error);
    throw error;
  }
};

