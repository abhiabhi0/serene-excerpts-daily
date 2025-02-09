
import { Book, ExcerptWithMeta } from "@/types/excerpt";
import { transformBookToExcerpts } from "@/utils/excerptTransformer";

let cachedExcerpts: Awaited<ReturnType<typeof transformBookToExcerpts>> | null = null;
let lastTransformTime: number = 0;

const shouldTransform = () => {
  const now = Date.now();
  // Transform if no cache exists or if it's past midnight since last transform
  if (!cachedExcerpts || !lastTransformTime) return true;
  
  const lastTransformDate = new Date(lastTransformTime);
  const currentDate = new Date(now);
  
  return lastTransformDate.getDate() !== currentDate.getDate();
};

const getTransformedExcerpts = async () => {
  if (shouldTransform()) {
    console.log("Transforming excerpts...");
    cachedExcerpts = await transformBookToExcerpts();
    lastTransformTime = Date.now();
  }
  return cachedExcerpts;
};

export const getRandomExcerpt = async (selectedBooks: string[] = []): Promise<ExcerptWithMeta> => {
  try {
    const excerpts = await getTransformedExcerpts();
    
    if (!excerpts || excerpts.length === 0) {
      throw new Error("No excerpts available");
    }
    
    // Filter by selected books if any are selected
    const availableExcerpts = selectedBooks.length > 0
      ? excerpts.filter(excerpt => selectedBooks.includes(excerpt.bookTitle))
      : excerpts;
    
    if (availableExcerpts.length === 0) {
      throw new Error("No excerpts available for selected books");
    }
    
    const randomExcerpt = availableExcerpts[Math.floor(Math.random() * availableExcerpts.length)];
    
    return {
      text: randomExcerpt.text,
      bookTitle: randomExcerpt.bookTitle,
      bookAuthor: randomExcerpt.bookAuthor,
      translator: randomExcerpt.translator
    };
  } catch (error) {
    console.error("Error fetching excerpt:", error);
    throw error;
  }
};
