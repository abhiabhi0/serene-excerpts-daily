import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ritualService } from '@/services/ritualService';
import { UserPracticeData } from '@/services/ritualService';

const CACHE_KEYS = {
  GRATITUDES: 'gratitudes',
  AFFIRMATIONS: 'affirmations',
  LAST_SYNC: 'last_sync',
  STREAK: 'streak'
};

export const useRitualSync = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from cache
  const loadFromCache = (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  };

  // Save data to cache
  const saveToCache = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Sync practice data (gratitudes and affirmations)
  const syncPracticeData = async () => {
    try {
      // Get data from cache
      const cachedGratitudes = loadFromCache(CACHE_KEYS.GRATITUDES) || [];
      const cachedAffirmations = loadFromCache(CACHE_KEYS.AFFIRMATIONS) || [];
      const lastSync = loadFromCache(CACHE_KEYS.LAST_SYNC);

      // If user is signed in, get data from database
      if (user) {
        const dbData = await ritualService.getPracticeData();
        
        // Compare with cache
        const dbGratitudes = dbData.gratitudes as string[];
        const dbAffirmations = dbData.affirmations as string[];

        // If data is different or no last sync, update cache
        if (!lastSync || 
            JSON.stringify(dbGratitudes) !== JSON.stringify(cachedGratitudes) ||
            JSON.stringify(dbAffirmations) !== JSON.stringify(cachedAffirmations)) {
          saveToCache(CACHE_KEYS.GRATITUDES, dbGratitudes);
          saveToCache(CACHE_KEYS.AFFIRMATIONS, dbAffirmations);
          saveToCache(CACHE_KEYS.LAST_SYNC, new Date().toISOString());
        }
      } else {
        // If not signed in, save cache data to database
        await ritualService.updatePracticeData({
          gratitudes: cachedGratitudes,
          affirmations: cachedAffirmations
        });
      }

      return {
        gratitudes: loadFromCache(CACHE_KEYS.GRATITUDES) || [],
        affirmations: loadFromCache(CACHE_KEYS.AFFIRMATIONS) || []
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync practice data');
      throw err;
    }
  };

  // Sync streak data
  const syncStreak = async () => {
    try {
      if (user) {
        const dbStreak = await ritualService.getStreak();
        const cachedStreak = loadFromCache(CACHE_KEYS.STREAK);

        // Update cache if different
        if (!cachedStreak || cachedStreak.current_streak !== dbStreak.current_streak) {
          saveToCache(CACHE_KEYS.STREAK, dbStreak);
        }

        return dbStreak;
      } else {
        const cachedStreak = loadFromCache(CACHE_KEYS.STREAK) || { current_streak: 0 };
        return cachedStreak;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync streak data');
      throw err;
    }
  };

  // Update streak when ritual is completed
  const updateRitualCompletion = async (isCompleted: boolean) => {
    try {
      if (isCompleted) {
        const updatedStreak = await ritualService.updateStreak();
        saveToCache(CACHE_KEYS.STREAK, updatedStreak);
        return updatedStreak;
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ritual completion');
      throw err;
    }
  };

  // Initial sync when component mounts or user changes
  useEffect(() => {
    const initializeSync = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          syncPracticeData(),
          syncStreak()
        ]);
      } catch (err) {
        console.error('Initial sync failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSync();
  }, [user]);

  return {
    isLoading,
    error,
    syncPracticeData,
    syncStreak,
    updateRitualCompletion
  };
}; 