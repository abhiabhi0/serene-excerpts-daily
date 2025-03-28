import { staticExcerpts } from "@/data/staticData";
import { ExcerptWithMeta } from "@/types/excerpt";

// Cache for excerpts
const excerptCache = new Map<string, ExcerptWithMeta[]>();
const CACHED_EXCERPTS_KEY = 'cached_excerpts';
const CACHE_SIZE = 15;

// Helper function to get random excerpts
function getRandomExcerpts(count: number, fromExcerpts: ExcerptWithMeta[]): ExcerptWithMeta[] {
  const shuffled = [...fromExcerpts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Helper function to get cached excerpts
function getCachedExcerpts(): ExcerptWithMeta[] {
  const cached = localStorage.getItem(CACHED_EXCERPTS_KEY);
  return cached ? JSON.parse(cached) : [];
}

// Helper function to update cached excerpts
function updateCachedExcerpts(excerpts: ExcerptWithMeta[]) {
  localStorage.setItem(CACHED_EXCERPTS_KEY, JSON.stringify(excerpts));
}

export const getRandomExcerpt = async (theme: string | null = null): Promise<ExcerptWithMeta> => {
  const cacheKey = theme || 'all';
  
  // Check in-memory cache first
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

// Function to get next excerpt from cache or generate new cache
export const getNextExcerpt = async (theme: string | null = null): Promise<ExcerptWithMeta> => {
  let cachedExcerpts = getCachedExcerpts();
  
  // If cache is empty or has only 1 excerpt, generate new cache
  if (cachedExcerpts.length <= 1) {
    console.log('Generating new cache of excerpts...');
    let filteredExcerpts = staticExcerpts;
    
    if (theme) {
      filteredExcerpts = staticExcerpts.filter(excerpt => 
        Array.isArray(excerpt.themes) && excerpt.themes.includes(theme)
      );
    }

    if (filteredExcerpts.length === 0) {
      throw new Error("No excerpts found for the selected theme");
    }

    cachedExcerpts = getRandomExcerpts(CACHE_SIZE, filteredExcerpts);
    updateCachedExcerpts(cachedExcerpts);
    console.log(`Generated new cache with ${cachedExcerpts.length} excerpts`);
  }

  // Get and remove the first excerpt from cache
  const excerpt = cachedExcerpts.shift()!;
  updateCachedExcerpts(cachedExcerpts);
  console.log(`Remaining excerpts in cache: ${cachedExcerpts.length}`);

  return excerpt;
};
