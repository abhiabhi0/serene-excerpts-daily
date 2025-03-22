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

export interface MorningRitualState {
  date: string;
  rituals: {
    wisdom: boolean;
    breathwork: boolean;
    gratitude: boolean;
    affirmations: boolean;
  };
  userId: string;
  last_updated: string;
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
    try {
      // Get current streak
      const { data: streakData, error: streakError } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', this.userId)
        .single();

      if (streakError) throw streakError;

      // Check if previous day's ritual was completed
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const { data: yesterdayRitual, error: ritualError } = await supabase
        .from('morning_rituals')
        .select('*')
        .eq('user_id', this.userId)
        .eq('date', yesterdayStr)
        .single();

      if (ritualError && ritualError.code !== 'PGRST116') throw ritualError;

      // Update streak based on previous day's completion
      const currentStreak = streakData?.current_streak || 0;
      const newStreak = yesterdayRitual ? currentStreak + 1 : 1;

      // Update streak in database
      const { data: updatedStreak, error: updateError } = await supabase
        .from('user_streaks')
        .upsert({
          user_id: this.userId,
          current_streak: newStreak,
          last_completed: new Date().toISOString(),
          last_updated: new Date().toISOString()
        })
        .select()
        .single();

      if (updateError) throw updateError;
      return updatedStreak;
    } catch (error) {
      console.error('Error updating streak:', error);
      throw error;
    }
  },

  async getCompletionHistory() {
    const { data, error } = await supabase
      .from('ritual_completions')
      .select('*')
      .order('completed_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get ritual state for a specific date
  async getRitualState(date: string, userId: string): Promise<MorningRitualState | null> {
    const { data, error } = await supabase
      .from('morning_rituals')
      .select('*')
      .eq('date', date)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching ritual state:', error);
      return null;
    }

    return data;
  },

  // Save ritual state
  async saveRitualState(state: MorningRitualState) {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('morning_rituals')
        .upsert({
          user_id: this.userId,
          date: state.date,
          rituals: state.rituals,
          last_updated: now
        })
        .select()
        .single();

      if (error) throw error;
      
      // Ensure the returned data has the correct last_updated timestamp
      return {
        ...data,
        last_updated: now
      };
    } catch (error) {
      console.error('Error saving ritual state:', error);
      throw error;
    }
  }
}; 