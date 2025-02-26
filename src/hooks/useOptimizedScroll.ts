
import { useCallback } from 'react';

export const useOptimizedScroll = () => {
  const optimizedScroll = useCallback((element: HTMLElement | null, offset = 0) => {
    if (!element) return;
    
    const elementRect = element.getBoundingClientRect();
    const absoluteElementTop = elementRect.top + window.pageYOffset;
    const middle = absoluteElementTop - (window.innerHeight / 2);
    window.scrollTo({ top: middle + offset, behavior: 'smooth' });
  }, []);

  return optimizedScroll;
};
