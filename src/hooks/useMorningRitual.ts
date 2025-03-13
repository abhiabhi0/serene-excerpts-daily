
import { useState, useEffect } from 'react';

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export const useMorningRitual = () => {
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: 'wisdom', label: 'Wisdom', checked: false },
    { id: 'gratitude', label: 'Gratitude', checked: false },
    { id: 'affirmation', label: 'Affirmation', checked: false },
  ]);

  // Load saved state from localStorage on component mount
  useEffect(() => {
    const savedDate = localStorage.getItem('morningRitualChecklistDate');
    const today = new Date().toLocaleDateString();
    
    // Check if we need to reset (new day or past 1:00 AM)
    const shouldReset = () => {
      if (!savedDate) return true;
      
      // If the date is different, we should reset
      if (savedDate !== today) {
        const currentTime = new Date();
        const resetTime = new Date();
        resetTime.setHours(1, 0, 0, 0); // 1:00 AM
        
        // If current time is past 1:00 AM, we should reset
        return currentTime >= resetTime;
      }
      
      return false;
    };
    
    if (shouldReset()) {
      // Reset checkboxes
      localStorage.setItem('morningRitualChecklistDate', today);
      localStorage.removeItem('morningRitualChecklist');
      setItems(items.map(item => ({ ...item, checked: false })));
    } else {
      // Load saved state
      const savedItems = localStorage.getItem('morningRitualChecklist');
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      }
    }
  }, []);

  // Schedule a reset check for 1:00 AM
  useEffect(() => {
    const scheduleReset = () => {
      const now = new Date();
      const resetTime = new Date();
      resetTime.setDate(now.getDate() + 1); // Tomorrow
      resetTime.setHours(1, 0, 0, 0); // 1:00 AM
      
      const timeUntilReset = resetTime.getTime() - now.getTime();
      
      // Schedule the reset
      const timer = setTimeout(() => {
        const today = new Date().toLocaleDateString();
        localStorage.setItem('morningRitualChecklistDate', today);
        localStorage.removeItem('morningRitualChecklist');
        setItems(items.map(item => ({ ...item, checked: false })));
        
        // Schedule the next reset
        scheduleReset();
      }, timeUntilReset);
      
      return timer;
    };
    
    const timer = scheduleReset();
    return () => clearTimeout(timer);
  }, [items]);

  // Toggle checkbox state
  const toggleItem = (id: string) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    
    setItems(newItems);
    localStorage.setItem('morningRitualChecklist', JSON.stringify(newItems));
  };

  return { items, toggleItem };
};
