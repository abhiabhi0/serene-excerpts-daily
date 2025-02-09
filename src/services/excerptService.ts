
import { ExcerptWithMeta, FlattenedExcerpt } from "@/types/excerpt";
import { getRandomExcerptFromFlattened } from "@/utils/excerptTransformer";
import { staticExcerpts } from "@/data/staticExcerpts";
import { getFilesHash, hasFilesChanged } from "@/utils/fileVersioning";

const FILES_HASH_KEY = 'filesHash';
const EXCERPTS_CACHE_KEY = 'flattenedExcerpts';

const convertFlatToExcerptWithMeta = (flat: FlattenedExcerpt): ExcerptWithMeta => ({
  text: flat.text,
  bookTitle: flat.bookTitle,
  bookAuthor: flat.bookAuthor,
  translator: flat.translator
});

const syncExcerptsWithCache = (excerpts: FlattenedExcerpt[]) => {
  localStorage.setItem(EXCERPTS_CACHE_KEY, JSON.stringify(excerpts));
  localStorage.setItem(FILES_HASH_KEY, getFilesHash());
  return excerpts;
};

export const getRandomExcerpt = async (): Promise<ExcerptWithMeta> => {
  try {
    const previousHash = localStorage.getItem(FILES_HASH_KEY);
    const filesChanged = hasFilesChanged(previousHash);
    console.log("Files changed?", filesChanged);

    let flattenedExcerpts: FlattenedExcerpt[];

    // Check if files have changed or if cache is empty
    if (filesChanged) {
      console.log("Files have changed or first load - using static excerpts");
      flattenedExcerpts = syncExcerptsWithCache(staticExcerpts);
    } else {
      // Try to get from cache
      const cached = localStorage.getItem(EXCERPTS_CACHE_KEY);
      if (cached) {
        console.log("Using cached excerpts");
        flattenedExcerpts = JSON.parse(cached);
      } else {
        console.log("Cache missing - using static excerpts");
        flattenedExcerpts = syncExcerptsWithCache(staticExcerpts);
      }
    }

    const randomExcerpt = getRandomExcerptFromFlattened(flattenedExcerpts);
    return convertFlatToExcerptWithMeta(randomExcerpt);
  } catch (error) {
    console.error("Error fetching excerpt:", error);
    throw error;
  }
};
