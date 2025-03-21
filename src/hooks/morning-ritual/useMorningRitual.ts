
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ChecklistItem, DEFAULT_ITEMS } from './types';
import { useRitualStorage } from './useRitualStorage';
import { useStreakManagement } from './useStreakManagement';
import { useDayChange } from './useDayChange';

export const useMorningRitual = () => {
  const [items, setItems] = useState<ChecklistItem[]>(DEFAULT_ITEMS);
  const { user } = useAuth();
  
  const { 
    isLoading, 
    setIsLoading,
    saveRitualToSupabase, 
    loadRitualFromSupabase 
  } = useRitualStorage(user?.id);
  
  const { 
    streak, 
    loadStreak, 
    loadLocalStreak,
    checkAndUpdateStreak,
    checkAndUpdateLocalStreak
  } = useStreakManagement(user?.id);
  
  const { checkForDayChange } = useDayChange(user?.id, setItems, DEFAULT_ITEMS);

  // Load saved state from localStorage or Supabase on component mount or when user changes
  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true);
      const today = new Date().toLocaleDateString();
      
      if (user) {
        // User is logged in, fetch from Supabase
        try {
          // Load streak data
          await loadStreak();
          
          // Get ritual data
          const ritualItems = await loadRitualFromSupabase(user.id, today);
          
          if (ritualItems) {
            setItems(ritualItems);
          } else {
            // If no data for today, check if it's a new day
            await checkForDayChange(true);
          }
        } catch (error) {
          console.error('Error syncing with Supabase:', error);
        }
      } else {
        // User is not logged in, use localStorage
        const savedItems = localStorage.getItem('morningRitualChecklist');
        const savedDate = localStorage.getItem('morningRitualChecklistDate');
        
        // Load streak from localStorage
        loadLocalStreak();
        
        if (savedDate !== today) {
          // It's a new day, reset
          await checkForDayChange(false);
        } else if (savedItems) {
          setItems(JSON.parse(savedItems));
        }
      }
      
      setIsLoading(false);
    };
    
    loadItems();
  }, [user]);

  // Sync changes with Supabase or localStorage
  useEffect(() => {
    const saveItems = async () => {
      if (isLoading) return; // Don't save while loading
      
      const today = new Date().toLocaleDateString();
      
      if (user) {
        // Save to Supabase
        await saveRitualToSupabase(items, today);
        
        // Check if all items are checked and update streak if needed
        await checkAndUpdateStreak(items);
      } else {
        // Save to localStorage
        localStorage.setItem('morningRitualChecklist', JSON.stringify(items));
        localStorage.setItem('morningRitualChecklistDate', today);
        
        // Check if all items are checked and update streak
        checkAndUpdateLocalStreak(items);
      }
    };
    
    if (!isLoading) {
      saveItems();
    }
  }, [items, user, isLoading]);

  // Toggle checkbox state
  const toggleItem = (id: string) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    
    setItems(newItems);
  };

  return { items, toggleItem, streak, isLoading };
};
