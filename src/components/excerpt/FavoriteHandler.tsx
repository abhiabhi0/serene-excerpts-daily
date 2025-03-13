
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { ExcerptWithMeta } from "@/types/excerpt";
import { useToast } from "@/components/ui/use-toast";

export const useFavoriteHandler = (excerpt: ExcerptWithMeta) => {
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Check if excerpt is in favorites by id or text
    const favorites = JSON.parse(localStorage.getItem('favoriteExcerpts') || '[]');
    const isFav = favorites.some((fav: ExcerptWithMeta) => 
      (excerpt.id && fav.id === excerpt.id) || fav.text === excerpt.text
    );
    setIsFavorite(isFav);
  }, [excerpt]);

  const handleToggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteExcerpts') || '[]');
    const localExcerpts = JSON.parse(localStorage.getItem('localExcerpts') || '[]');
  
    if (isFavorite) {
      // Remove from favorites
      const updatedFavorites = favorites.filter((fav: ExcerptWithMeta) => 
        !((excerpt.id && fav.id === excerpt.id) || fav.text === excerpt.text)
      );
      localStorage.setItem('favoriteExcerpts', JSON.stringify(updatedFavorites));
      setIsFavorite(false);
    
      // Remove from local excerpts if it was added as a favorite
      const updatedLocalExcerpts = localExcerpts.filter((ex: any) => 
        !(ex.text === excerpt.text && ex.type === 'favorite')
      );
      localStorage.setItem('localExcerpts', JSON.stringify(updatedLocalExcerpts));
    
      toast({
        title: "Removed from favorites",
        description: "Excerpt has been removed from your collection",
        className: "bottom-0 right-0 flex fixed md:max-w-[420px] md:bottom-4 md:right-4"
      });
    } else {
      // Add to favorites
      const favoriteExcerpt = {
        ...excerpt,
        id: excerpt.id || uuidv4(),
        isFavorite: true
      };
      localStorage.setItem('favoriteExcerpts', JSON.stringify([...favorites, favoriteExcerpt]));
      setIsFavorite(true);

      // Add to local excerpts as a favorite
      const localExcerpt = {
        id: favoriteExcerpt.id,
        bookTitle: excerpt.bookTitle || 'Unknown',
        bookAuthor: excerpt.bookAuthor,
        translator: excerpt.translator,
        text: excerpt.text,
        category: excerpt.bookTitle || 'Favorites',
        language: 'en',
        createdAt: new Date().toISOString(),
        type: 'favorite' as const
      };

      // Check if excerpt already exists in local excerpts (for backward compatibility)
      const existingIndex = localExcerpts.findIndex((ex: any) => ex.text === excerpt.text);
      if (existingIndex === -1) {
        // Add new excerpt with favorite type
        localStorage.setItem('localExcerpts', JSON.stringify([...localExcerpts, localExcerpt]));
      } else {
        // Update existing excerpt to include favorite type if it doesn't have it
        const updatedExcerpts = [...localExcerpts];
        updatedExcerpts[existingIndex] = {
          ...updatedExcerpts[existingIndex],
          type: 'favorite',
          id: localExcerpt.id
        };
        localStorage.setItem('localExcerpts', JSON.stringify(updatedExcerpts));
      }

      toast({
        title: "Added to favorites",
        description: "Excerpt has been added to your collection",
        className: "bottom-0 right-0 flex fixed md:max-w-[420px] md:bottom-4 md:right-4"
      });
    }
  };

  return { isFavorite, handleToggleFavorite };
};
