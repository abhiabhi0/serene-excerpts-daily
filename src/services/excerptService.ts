  import { staticExcerpts } from "@/data/staticData";
  import { ExcerptWithMeta } from "@/types/excerpt";
    export const getRandomExcerpt = async (theme: string | null = null): Promise<ExcerptWithMeta> => {
      console.log('------ getRandomExcerpt called ------');
      console.log('Theme parameter:', theme ? `"${theme}"` : 'null (All)');
  
      let filteredExcerpts = staticExcerpts;
      console.log('Total excerpts available:', staticExcerpts.length);
  
      // Log some sample themes from the data to debug
      const sampleThemes = staticExcerpts
        .slice(0, 5)
        .map(e => ({ text: e.text.substring(0, 30), themes: e.themes }));
      console.log('Sample excerpt themes:', sampleThemes);
  
      if (theme) {
        console.log('Filtering excerpts for theme:', theme);
        filteredExcerpts = staticExcerpts.filter(excerpt => {
          // Check if excerpt.themes exists and includes the theme
          const hasTheme = Array.isArray(excerpt.themes) && excerpt.themes.includes(theme);
          if (hasTheme) {
            console.log('Found matching excerpt:', excerpt.text.substring(0, 50));
          }
          return hasTheme;
        });
        console.log('Filtered excerpts count:', filteredExcerpts.length);
      } else {
        console.log('No theme filter applied, using all excerpts');
      }

      if (filteredExcerpts.length === 0) {
        console.error('No excerpts found for theme:', theme);
        throw new Error("No excerpts found for the selected theme");
      }

      const randomIndex = Math.floor(Math.random() * filteredExcerpts.length);
      const selectedExcerpt = filteredExcerpts[randomIndex];
  
      console.log('Selected excerpt:', {
        text: selectedExcerpt.text.substring(0, 50) + '...',
        themes: selectedExcerpt.themes,
        bookTitle: selectedExcerpt.bookTitle
      });
  
      return {
        text: selectedExcerpt.text,
        bookTitle: selectedExcerpt.bookTitle,
        bookAuthor: selectedExcerpt.bookAuthor,
        translator: selectedExcerpt.translator,
        amazonLink: selectedExcerpt.amazonLink,
        themes: selectedExcerpt.themes
      };
    };
