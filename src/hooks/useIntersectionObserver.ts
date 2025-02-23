import { useEffect, useState, RefObject } from 'react';

interface UseIntersectionObserverProps {
  ref: RefObject<Element>;
  options?: IntersectionObserverInit;
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver({
  ref,
  options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  },
  freezeOnceVisible = false,
}: UseIntersectionObserverProps): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const frozen = freezeOnceVisible && isVisible;
    if (frozen) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, options, freezeOnceVisible, isVisible]);

  return isVisible;
} 