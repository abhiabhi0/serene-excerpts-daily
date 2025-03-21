import { supabase } from '@/integrations/supabase/client';

export interface GratitudeEntry {
  id: string;
  content: string;
  created_at: string;
}

export interface Affirmation {
  id: string;
  content: string;
  created_at: string;
}

export interface MorningRitualStreak {
  current_streak: number;
  longest_streak: number;
  last_completed_date: string | null;
}

export interface MorningRitual {
  date: string;
  items: {
    gratitudes: string[];
    affirmations: string[];
    rituals: {
      wisdom: boolean;
      gratitude: boolean;
      affirmations: boolean;
      breathwork: boolean;
    };
  };
}

export interface UserPracticeData {
  gratitudes: string[];
  affirmations: string[];
}

export const ritualService = {
  // Gratitude methods
  async addGratitudeEntry(content: string) {
    const { data, error } = await supabase
      .from('gratitude_entries')
      .insert([{ content }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getGratitudeEntries() {
    const { data, error } = await supabase
      .from('gratitude_entries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Affirmation methods
  async addAffirmation(content: string) {
    const { data, error } = await supabase
      .from('affirmations')
      .insert([{ content }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAffirmations() {
    const { data, error } = await supabase
      .from('affirmations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Practice data methods (gratitudes and affirmations)
  async getPracticeData() {
    const { data, error } = await supabase
      .from('user_practice_data')
      .select('*')
      .single();

    if (error) throw error;
    return data as UserPracticeData;
  },

  async updatePracticeData(practiceData: UserPracticeData) {
    const { data, error } = await supabase
      .from('user_practice_data')
      .upsert({
        gratitudes: practiceData.gratitudes,
        affirmations: practiceData.affirmations,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Morning ritual methods
  async getMorningRitual(date: string) {
    const { data, error } = await supabase
      .from('morning_rituals')
      .select('*')
      .eq('date', date)
      .single();

    if (error) throw error;
    return data as MorningRitual;
  },

  async saveMorningRitual(ritual: MorningRitual) {
    const { data, error } = await supabase
      .from('morning_rituals')
      .upsert({
        date: ritual.date,
        items: ritual.items
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Streak methods
  async getStreak() {
    const { data, error } = await supabase
      .from('user_streaks')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  async updateStreak() {
    const today = new Date().toISOString().split('T')[0];
    
    // First, check if we already completed today's ritual
    const { data: existingRitual } = await supabase
      .from('morning_rituals')
      .select('*')
      .eq('date', today)
      .single();

    if (existingRitual) {
      return existingRitual;
    }

    // Get current streak
    const { data: currentStreak } = await supabase
      .from('user_streaks')
      .select('*')
      .single();

    // Calculate new streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const { data: yesterdayRitual } = await supabase
      .from('morning_rituals')
      .select('*')
      .eq('date', yesterdayStr)
      .single();

    const isConsecutiveDay = !!yesterdayRitual;
    const newCurrentStreak = isConsecutiveDay ? (currentStreak?.current_streak || 0) + 1 : 1;

    // Update streak
    const { data: updatedStreak, error: streakError } = await supabase
      .from('user_streaks')
      .upsert({
        current_streak: newCurrentStreak,
        last_updated: new Date().toISOString()
      })
      .select()
      .single();

    if (streakError) throw streakError;

    return updatedStreak;
  },

  async getCompletionHistory() {
    const { data, error } = await supabase
      .from('ritual_completions')
      .select('*')
      .order('completed_date', { ascending: false });

    if (error) throw error;
    return data;
  }
}; 