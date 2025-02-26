import React, { useCallback } from 'react';
import { useOptimizedScroll } from "@/hooks/useOptimizedScroll";

interface VirtualizedListProps {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  estimatedItemHeight: number;
}

export const VirtualizedList = ({ items, renderItem, estimatedItemHeight }: VirtualizedListProps) => {
  const optimizedScroll = useOptimizedScroll();

  const scrollToItem = useCallback((index: number) => {
    const element = document.getElementById(`item-${index}`);
    if (element) {
      optimizedScroll(element);
    }
  }, [optimizedScroll]);

  return (
    <div>
      {items.map((item, index) => (
        <div key={index} id={`item-${index}`} style={{ height: estimatedItemHeight }}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
};
