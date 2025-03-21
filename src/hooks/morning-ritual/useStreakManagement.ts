
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChecklistItem } from './types';

export const useStreakManagement = (userId: string | undefined) => {
  const [streak, setStreak] = useState(0);

  // Load streak data
  const loadStreak = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('current_streak')
        .eq('user_id', userId)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching streak data:', error);
        return;
      }
      
      if (data) {
        setStreak(data.current_streak);
      }
    } catch (error) {
      console.error('Error loading streak:', error);
    }
  };

  // Update streak in Supabase
  const updateStreakInSupabase = async (newStreak: number) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('user_streaks')
        .upsert({ 
          user_id: userId, 
          current_streak: newStreak,
          last_updated: new Date().toISOString()
        });
        
      if (error) {
        console.error('Error updating streak:', error);
      } else {
        setStreak(newStreak);
      }
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  // Check if all items are completed and potentially update streak
  const checkAndUpdateStreak = async (items: ChecklistItem[]) => {
    const allCompleted = items.every(item => item.checked);
    
    if (!allCompleted || !userId) return; // Only update on completion
    
    try {
      // Get current streak
      const { data, error } = await supabase
        .from('user_streaks')
        .select('current_streak')
        .eq('user_id', userId)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching streak data:', error);
        return;
      }
      
      // Already have a streak value, don't update to avoid double counting
      if (data) return;
      
      // First completion, set streak to 1
      await updateStreakInSupabase(1);
    } catch (error) {
      console.error('Error in checkAndUpdateStreak:', error);
    }
  };

  // Update/reset streak based on completion status
  const updateStreakBasedOnCompletion = async (allCompleted: boolean) => {
    if (!userId) return;
    
    if (allCompleted) {
      // Maintain streak
      const newStreak = streak + 1;
      await updateStreakInSupabase(newStreak);
    } else {
      // Reset streak
      await updateStreakInSupabase(0);
    }
  };

  // Use localStorage for streak when not logged in
  const updateLocalStreak = (allCompleted: boolean) => {
    if (allCompleted) {
      // Increment streak
      const newStreak = streak + 1;
      localStorage.setItem('morningRitualStreak', newStreak.toString());
      setStreak(newStreak);
    } else {
      // Reset streak
      localStorage.setItem('morningRitualStreak', '0');
      setStreak(0);
    }
  };

  // Load streak from localStorage
  const loadLocalStreak = () => {
    const savedStreak = localStorage.getItem('morningRitualStreak');
    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    }
  };

  // Update streak for first completion when using localStorage
  const checkAndUpdateLocalStreak = (items: ChecklistItem[]) => {
    const allCompleted = items.every(item => item.checked);
    
    if (allCompleted && streak === 0) {
      localStorage.setItem('morningRitualStreak', '1');
      setStreak(1);
    }
  };
  
  return {
    streak,
    setStreak,
    loadStreak,
    updateStreakInSupabase,
    checkAndUpdateStreak,
    updateStreakBasedOnCompletion,
    updateLocalStreak,
    loadLocalStreak,
    checkAndUpdateLocalStreak
  };
};
