import { staticExcerpts } from "@/data/staticData";
import { ExcerptWithMeta } from "@/types/excerpt";

// Cache for excerpts
const excerptCache = new Map<string, ExcerptWithMeta[]>();

export const getRandomExcerpt = async (theme: string | null = null): Promise<ExcerptWithMeta> => {
  const cacheKey = theme || 'all';
  
  // Check cache first
  if (excerptCache.has(cacheKey)) {
    const cachedExcerpts = excerptCache.get(cacheKey)!;
    const randomIndex = Math.floor(Math.random() * cachedExcerpts.length);
    return cachedExcerpts[randomIndex];
  }

  // If not in cache, filter and cache the results
  let filteredExcerpts = staticExcerpts;
  
  if (theme) {
    filteredExcerpts = staticExcerpts.filter(excerpt => 
      Array.isArray(excerpt.themes) && excerpt.themes.includes(theme)
    );
  }

  if (filteredExcerpts.length === 0) {
    throw new Error("No excerpts found for the selected theme");
  }

  // Cache the filtered results
  excerptCache.set(cacheKey, filteredExcerpts);

  const randomIndex = Math.floor(Math.random() * filteredExcerpts.length);
  return {
    text: filteredExcerpts[randomIndex].text,
    bookTitle: filteredExcerpts[randomIndex].bookTitle,
    bookAuthor: filteredExcerpts[randomIndex].bookAuthor,
    translator: filteredExcerpts[randomIndex].translator,
    amazonLink: filteredExcerpts[randomIndex].amazonLink,
    themes: filteredExcerpts[randomIndex].themes
  };
};

// Preload function to warm up the cache
export const preloadExcerpts = async () => {
  // Preload all themes
  const themes = Array.from(new Set(staticExcerpts.flatMap(e => e.themes || [])));
  await Promise.all([
    getRandomExcerpt(null), // Preload all excerpts
    ...themes.map(theme => getRandomExcerpt(theme))
  ]);
};
