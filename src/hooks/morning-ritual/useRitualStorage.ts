
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChecklistItem } from './types';

export const useRitualStorage = (userId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false);

  // Save ritual items to Supabase
  const saveRitualToSupabase = async (
    items: ChecklistItem[], 
    today: string
  ) => {
    if (!userId) return;
    
    try {
      // Check if we already have an entry for today
      const { data, error: fetchError } = await supabase
        .from('morning_rituals')
        .select('id')
        .eq('user_id', userId)
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
            user_id: userId, 
            date: today, 
            items: JSON.stringify(items) 
          });
      }
    } catch (error) {
      console.error('Error saving to Supabase:', error);
    }
  };

  // Load ritual data from Supabase
  const loadRitualFromSupabase = async (
    userId: string, 
    today: string
  ): Promise<ChecklistItem[] | null> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('morning_rituals')
        .select('items')
        .eq('user_id', userId)
        .eq('date', today)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching ritual data:', error);
        return null;
      }
      
      // Ensure we're parsing a string - cast to string if needed
      if (data?.items) {
        const itemsStr = String(data.items);
        return JSON.parse(itemsStr);
      }
      return null;
    } catch (error) {
      console.error('Error loading from Supabase:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Get ritual data for a specific date
  const getRitualByDate = async (
    userId: string, 
    date: string
  ): Promise<ChecklistItem[] | null> => {
    try {
      const { data, error } = await supabase
        .from('morning_rituals')
        .select('items')
        .eq('user_id', userId)
        .eq('date', date)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking date completion:', error);
        return null;
      }
      
      // Ensure we're parsing a string - cast to string if needed
      if (data?.items) {
        const itemsStr = String(data.items);
        return JSON.parse(itemsStr);
      }
      return null;
    } catch (error) {
      console.error('Error in getRitualByDate:', error);
      return null;
    }
  };
  
  return {
    isLoading,
    setIsLoading,
    saveRitualToSupabase,
    loadRitualFromSupabase,
    getRitualByDate
  };
};
