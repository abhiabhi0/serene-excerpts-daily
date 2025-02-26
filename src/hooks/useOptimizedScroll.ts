
import { useCallback } from 'react';

export const useOptimizedScroll = () => {
  const optimizedScroll = useCallback((element: HTMLElement | null, offset = 0) => {
    if (!element) return;
    
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'center'
    });
  }, []);

  return optimizedScroll;
};
