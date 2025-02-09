
import { ExcerptWithMeta, FlattenedExcerpt } from "@/types/excerpt";
import { createFlattenedExcerpts, getRandomExcerptFromFlattened } from "@/utils/excerptTransformer";

const convertFlatToExcerptWithMeta = (flat: FlattenedExcerpt): ExcerptWithMeta => ({
  text: flat.text,
  bookTitle: flat.bookTitle,
  bookAuthor: flat.bookAuthor,
  translator: flat.translator
});

export const getRandomExcerpt = async (): Promise<ExcerptWithMeta> => {
  try {
    // Try to get from localStorage first
    const cached = localStorage.getItem('flattenedExcerpts');
    let flattenedExcerpts: FlattenedExcerpt[];

    if (cached) {
      flattenedExcerpts = JSON.parse(cached);
      console.log("Using cached flattened excerpts");
    } else {
      // If not in cache, create and store them
      console.log("Creating new flattened excerpts");
      flattenedExcerpts = await createFlattenedExcerpts();
    }

    const randomExcerpt = getRandomExcerptFromFlattened(flattenedExcerpts);
    return convertFlatToExcerptWithMeta(randomExcerpt);
  } catch (error) {
    console.error("Error fetching excerpt:", error);
    throw error;
  }
};
