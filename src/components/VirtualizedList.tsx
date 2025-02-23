import { useEffect, useRef, useState } from 'react';
import { useOptimizedScroll } from '@/hooks/useOptimizedScroll';

interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  className?: string;
}

export function VirtualizedList<T>({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  overscan = 3,
  className,
}: VirtualizedListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [startIndex, setStartIndex] = useState(0);
  const { scrollY } = useOptimizedScroll(20, 100);

  useEffect(() => {
    if (!containerRef.current) return;

    const element = containerRef.current;
    const elementTop = element.offsetTop;
    const viewportTop = scrollY;
    const relativeTop = viewportTop - elementTop;

    const newStartIndex = Math.max(
      0,
      Math.floor(relativeTop / itemHeight) - overscan
    );

    setStartIndex(newStartIndex);
  }, [scrollY, itemHeight, overscan]);

  const visibleItems = Math.ceil(containerHeight / itemHeight) + 2 * overscan;
  const endIndex = Math.min(startIndex + visibleItems, items.length);
  const translateY = startIndex * itemHeight;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ height: containerHeight }}
    >
      <div
        className="absolute top-0 left-0 w-full force-gpu"
        style={{
          height: items.length * itemHeight,
          transform: `translate3d(0, ${translateY}px, 0)`,
        }}
      >
        {items.slice(startIndex, endIndex).map((item, index) => (
          <div
            key={startIndex + index}
            className="absolute w-full force-gpu"
            style={{
              height: itemHeight,
              transform: `translate3d(0, ${(startIndex + index) * itemHeight}px, 0)`,
            }}
          >
            {renderItem(item, startIndex + index)}
          </div>
        ))}
      </div>
    </div>
  );
} 