
import { staticExcerpts } from "@/data/staticData";
import { ExcerptWithMeta } from "@/types/excerpt";

export const getRandomExcerpt = async (theme: string | null = null): Promise<ExcerptWithMeta> => {
  let filteredExcerpts = staticExcerpts;
  
  if (theme) {
    filteredExcerpts = staticExcerpts.filter(excerpt => 
      excerpt.themes?.includes(theme)
    );
  }

  if (filteredExcerpts.length === 0) {
    throw new Error("No excerpts found for the selected theme");
  }

  const randomIndex = Math.floor(Math.random() * filteredExcerpts.length);
  const selectedExcerpt = filteredExcerpts[randomIndex];

  return {
    text: selectedExcerpt.text,
    bookTitle: selectedExcerpt.bookTitle,
    bookAuthor: selectedExcerpt.bookAuthor,
    translator: selectedExcerpt.translator,
    amazonLink: selectedExcerpt.amazonLink
  };
};
