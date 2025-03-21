
import { ChecklistItem } from './types';
import { useRitualStorage } from './useRitualStorage';
import { useStreakManagement } from './useStreakManagement';

export const useDayChange = (
  userId: string | undefined,
  setItems: (items: ChecklistItem[]) => void,
  defaultItems: ChecklistItem[]
) => {
  const { getRitualByDate } = useRitualStorage(userId);
  const { 
    updateStreakBasedOnCompletion, 
    updateLocalStreak,
    streak 
  } = useStreakManagement(userId);

  // Check for day change and reset items
  const checkForDayChange = async (isSupabase: boolean) => {
    const today = new Date().toLocaleDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toLocaleDateString();
    
    // Reset items for a new day
    setItems(defaultItems.map(item => ({ ...item, checked: false })));
    
    if (isSupabase && userId) {
      // Check if user completed yesterday's ritual for streak
      await checkYesterdayCompletion(yesterdayString);
    } else {
      // For localStorage, check the saved date
      const savedDate = localStorage.getItem('morningRitualChecklistDate');
      const savedItems = localStorage.getItem('morningRitualChecklist');
      
      if (savedDate === yesterdayString && savedItems) {
        const parsedItems = JSON.parse(savedItems);
        const allCompleted = parsedItems.every((item: ChecklistItem) => item.checked);
        
        updateLocalStreak(allCompleted);
      } else {
        // Not consecutive days, reset streak
        updateLocalStreak(false);
      }
      
      localStorage.setItem('morningRitualChecklistDate', today);
    }
  };

  // Check if user completed yesterday's ritual for streak (Supabase)
  const checkYesterdayCompletion = async (yesterdayString: string) => {
    if (!userId) return;
    
    try {
      const yesterdayItems = await getRitualByDate(userId, yesterdayString);
      
      if (yesterdayItems) {
        const allCompleted = yesterdayItems.every((item: ChecklistItem) => item.checked);
        await updateStreakBasedOnCompletion(allCompleted);
      } else {
        // No data for yesterday, reset streak
        await updateStreakBasedOnCompletion(false);
      }
    } catch (error) {
      console.error('Error in checkYesterdayCompletion:', error);
    }
  };
  
  return {
    checkForDayChange,
    checkYesterdayCompletion
  };
};
