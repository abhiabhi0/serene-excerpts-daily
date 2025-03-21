
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

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
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load saved state from localStorage on component mount or when user changes
  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true);
      const today = new Date().toLocaleDateString();
      
      if (user) {
        // User is logged in, fetch from Supabase
        try {
          // Get ritual data
          const { data: ritualData, error: ritualError } = await supabase
            .from('morning_rituals')
            .select('*')
            .eq('user_id', user.id)
            .eq('date', today)
            .single();
          
          if (ritualError && ritualError.code !== 'PGRST116') {
            console.error('Error fetching ritual data:', ritualError);
          }
          
          // Get streak data
          const { data: streakData, error: streakError } = await supabase
            .from('user_streaks')
            .select('current_streak')
            .eq('user_id', user.id)
            .single();
            
          if (streakError && streakError.code !== 'PGRST116') {
            console.error('Error fetching streak data:', streakError);
          }
          
          if (ritualData) {
            setItems(JSON.parse(ritualData.items));
          } else {
            // If no data for today, check if it's a new day
            checkForDayChange(true);
          }
          
          if (streakData) {
            setStreak(streakData.current_streak);
          }
        } catch (error) {
          console.error('Error syncing with Supabase:', error);
        }
      } else {
        // User is not logged in, use localStorage
        const savedItems = localStorage.getItem('morningRitualChecklist');
        const savedDate = localStorage.getItem('morningRitualChecklistDate');
        const savedStreak = localStorage.getItem('morningRitualStreak');
        
        if (savedStreak) {
          setStreak(parseInt(savedStreak));
        }
        
        if (savedDate !== today) {
          // It's a new day, reset
          checkForDayChange(false);
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
        try {
          // Check if we already have an entry for today
          const { data, error: fetchError } = await supabase
            .from('morning_rituals')
            .select('id')
            .eq('user_id', user.id)
            .eq('date', today);
            
          if (fetchError) throw fetchError;
          
          if (data && data.length > 0) {
            // Update existing entry
            await supabase
              .from('morning_rituals')
              .update({ items: JSON.stringify(items) })
              .eq('id', data[0].id);
          } else {
            // Create new entry
            await supabase
              .from('morning_rituals')
              .insert({ 
                user_id: user.id, 
                date: today, 
                items: JSON.stringify(items) 
              });
          }
          
          // Check if all items are checked and update streak if needed
          checkAndUpdateStreak();
        } catch (error) {
          console.error('Error saving to Supabase:', error);
        }
      } else {
        // Save to localStorage
        localStorage.setItem('morningRitualChecklist', JSON.stringify(items));
        localStorage.setItem('morningRitualChecklistDate', today);
        
        // Check if all items are checked and update streak
        checkAndUpdateStreak();
      }
    };
    
    if (!isLoading) {
      saveItems();
    }
  }, [items, user, isLoading]);

  // Check for day change and reset items
  const checkForDayChange = (isSupabase: boolean) => {
    const today = new Date().toLocaleDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toLocaleDateString();
    
    // Reset items for a new day
    setItems(items.map(item => ({ ...item, checked: false })));
    
    if (isSupabase) {
      // Check if user completed yesterday's ritual for streak
      checkYesterdayCompletion(yesterdayString);
    } else {
      // For localStorage, check the saved date
      const savedDate = localStorage.getItem('morningRitualChecklistDate');
      const savedItems = localStorage.getItem('morningRitualChecklist');
      
      if (savedDate === yesterdayString && savedItems) {
        const parsedItems = JSON.parse(savedItems);
        const allCompleted = parsedItems.every((item: ChecklistItem) => item.checked);
        
        if (allCompleted) {
          // Maintain streak
          localStorage.setItem('morningRitualStreak', (streak + 1).toString());
          setStreak(streak + 1);
        } else {
          // Reset streak
          localStorage.setItem('morningRitualStreak', '0');
          setStreak(0);
        }
      } else {
        // Not consecutive days, reset streak
        localStorage.setItem('morningRitualStreak', '0');
        setStreak(0);
      }
      
      localStorage.setItem('morningRitualChecklistDate', today);
    }
  };

  // Check if user completed yesterday's ritual for streak (Supabase)
  const checkYesterdayCompletion = async (yesterdayString: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('morning_rituals')
        .select('items')
        .eq('user_id', user.id)
        .eq('date', yesterdayString)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking yesterday completion:', error);
        return;
      }
      
      if (data) {
        const parsedItems = JSON.parse(data.items);
        const allCompleted = parsedItems.every((item: ChecklistItem) => item.checked);
        
        if (allCompleted) {
          // Maintain streak
          const newStreak = streak + 1;
          
          const { error: updateError } = await supabase
            .from('user_streaks')
            .upsert({ 
              user_id: user.id, 
              current_streak: newStreak,
              last_updated: new Date().toISOString()
            });
            
          if (updateError) {
            console.error('Error updating streak:', updateError);
          } else {
            setStreak(newStreak);
          }
        } else {
          // Reset streak
          const { error: resetError } = await supabase
            .from('user_streaks')
            .upsert({ 
              user_id: user.id, 
              current_streak: 0,
              last_updated: new Date().toISOString()
            });
            
          if (resetError) {
            console.error('Error resetting streak:', resetError);
          } else {
            setStreak(0);
          }
        }
      } else {
        // No data for yesterday, reset streak
        const { error: resetError } = await supabase
          .from('user_streaks')
          .upsert({ 
            user_id: user.id, 
            current_streak: 0,
            last_updated: new Date().toISOString()
          });
          
        if (resetError) {
          console.error('Error resetting streak:', resetError);
        } else {
          setStreak(0);
        }
      }
    } catch (error) {
      console.error('Error in checkYesterdayCompletion:', error);
    }
  };

  // Check if all items are checked and update streak
  const checkAndUpdateStreak = async () => {
    const allCompleted = items.every(item => item.checked);
    
    if (!allCompleted) return; // Only update on completion
    
    if (user) {
      try {
        // Get current streak
        const { data, error } = await supabase
          .from('user_streaks')
          .select('current_streak')
          .eq('user_id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching streak data:', error);
          return;
        }
        
        // Already have a streak value, don't update to avoid double counting
        if (data) return;
        
        // First completion, set streak to 1
        const { error: updateError } = await supabase
          .from('user_streaks')
          .upsert({ 
            user_id: user.id, 
            current_streak: 1,
            last_updated: new Date().toISOString()
          });
          
        if (updateError) {
          console.error('Error updating streak:', updateError);
        } else {
          setStreak(1);
        }
      } catch (error) {
        console.error('Error in checkAndUpdateStreak:', error);
      }
    } else {
      // For localStorage, only set to 1 if it was previously 0
      if (streak === 0) {
        localStorage.setItem('morningRitualStreak', '1');
        setStreak(1);
      }
    }
  };

  // Toggle checkbox state
  const toggleItem = (id: string) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    
    setItems(newItems);
  };

  return { items, toggleItem, streak, isLoading };
};
