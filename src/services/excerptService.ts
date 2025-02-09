
import { TransformedExcerpt } from "@/utils/excerptTransformer";
import { transformExcerpts } from "@/utils/excerptTransformer";

let cachedExcerpts: TransformedExcerpt[] | null = null;

export const getRandomExcerpt = async (): Promise<TransformedExcerpt> => {
  try {
    if (!cachedExcerpts) {
      console.log("Initializing excerpt cache...");
      cachedExcerpts = await transformExcerpts();
    }

    if (!cachedExcerpts.length) {
      throw new Error("No excerpts available");
    }

    const randomExcerpt = cachedExcerpts[Math.floor(Math.random() * cachedExcerpts.length)];
    return randomExcerpt;
  } catch (error) {
    console.error("Error fetching excerpt:", error);
    throw error;
  }
};

export const getAllBookTitles = async (): Promise<string[]> => {
  try {
    if (!cachedExcerpts) {
      cachedExcerpts = await transformExcerpts();
    }
    
    const uniqueTitles = [...new Set(cachedExcerpts.map(excerpt => excerpt.bookTitle))];
    return uniqueTitles.sort();
  } catch (error) {
    console.error("Error fetching book titles:", error);
    return [];
  }
};
