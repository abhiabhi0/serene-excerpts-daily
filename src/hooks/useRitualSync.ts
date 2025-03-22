import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ritualService, MorningRitualState } from '@/services/ritualService';

const CACHE_KEYS = {
  RITUAL_STATE: 'morningRitualState',
  RITUAL_DATE: 'morningRitualDate',
  STREAK: 'morningRitualStreak',
  CACHE_TIMESTAMP: 'cacheTimestamp',
  LAST_UPDATED: 'lastUpdated'
};

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface PendingSync {
  rituals: any;
  date: string;
  timestamp: number;
}

export const useRitualSync = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check if cache is valid
  const isCacheValid = () => {
    const timestamp = loadFromCache(CACHE_KEYS.CACHE_TIMESTAMP)?.timestamp;
    if (!timestamp) return false;
    return Date.now() - timestamp < CACHE_TTL;
  };

  // Load data from cache
  const loadFromCache = (key: string) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('Error loading from cache:', err);
      return null;
    }
  };

  // Save data to cache with timestamp
  const saveToCache = (key: string, data: any) => {
    try {
      const timestamp = new Date().toISOString();
      localStorage.setItem(key, JSON.stringify(data));
      localStorage.setItem(CACHE_KEYS.CACHE_TIMESTAMP, JSON.stringify({ timestamp: Date.now() }));
      localStorage.setItem(CACHE_KEYS.LAST_UPDATED, timestamp);
    } catch (err) {
      console.error('Error saving to cache:', err);
    }
  };

  // Invalidate cache
  const invalidateCache = () => {
    try {
      Object.values(CACHE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (err) {
      console.error('Error invalidating cache:', err);
    }
  };

  // Check if any ritual is completed
  const hasAnyRitualCompleted = (rituals: any) => {
    return Object.values(rituals).some(completed => completed);
  };

  // Get the most up-to-date ritual state
  const getMostRecentState = (dbState: MorningRitualState | null, cacheState: MorningRitualState | null): MorningRitualState | null => {
    if (!dbState) return cacheState;
    if (!cacheState) return dbState;

    const dbTimestamp = new Date(dbState.last_updated).getTime();
    const cacheTimestamp = new Date(cacheState.last_updated).getTime();

    return dbTimestamp > cacheTimestamp ? dbState : cacheState;
  };

  // Sync ritual state
  const syncRitualState = async () => {
    try {
      const today = new Date().toLocaleDateString();
      const cachedState = loadFromCache(CACHE_KEYS.RITUAL_STATE);
      const savedDate = loadFromCache(CACHE_KEYS.RITUAL_DATE);
      
      // If it's a new day, reset state
      if (savedDate !== today) {
        // If online and user is logged in, fetch from DB
        let dbState = null;
        if (user && isOnline) {
          try {
            dbState = await ritualService.getRitualState(today, user.id);
          } catch (err) {
            console.error('Error fetching from DB:', err);
          }
        }

        // If we have data for today from DB, use it
        if (dbState) {
          saveToCache(CACHE_KEYS.RITUAL_STATE, dbState);
          saveToCache(CACHE_KEYS.RITUAL_DATE, today);
          return dbState;
        }

        // If no data for today, create empty state
        const emptyState: MorningRitualState = {
          date: today,
          rituals: {
            wisdom: false,
            breathwork: false,
            gratitude: false,
            affirmations: false
          },
          userId: user?.id || '',
          last_updated: new Date().toISOString()
        };
        saveToCache(CACHE_KEYS.RITUAL_STATE, emptyState);
        saveToCache(CACHE_KEYS.RITUAL_DATE, today);
        return emptyState;
      }

      // If it's the same day, use cached state if available
      if (cachedState) {
        // If online and user is logged in, try to sync with DB
        if (user && isOnline) {
          try {
            const dbState = await ritualService.getRitualState(today, user.id);
            if (dbState) {
              // Compare timestamps to use the most recent data
              const dbTimestamp = new Date(dbState.last_updated).getTime();
              const cacheTimestamp = new Date(cachedState.last_updated).getTime();
              
              if (dbTimestamp > cacheTimestamp) {
                saveToCache(CACHE_KEYS.RITUAL_STATE, dbState);
                saveToCache(CACHE_KEYS.RITUAL_DATE, today);
                return dbState;
              }
            }
          } catch (err) {
            console.error('Error fetching from DB:', err);
          }
        }
        // If DB fetch failed or cache is more recent, use cached state
        return cachedState;
      }

      // If no cached state, try to fetch from DB
      if (user && isOnline) {
        try {
          const dbState = await ritualService.getRitualState(today, user.id);
          if (dbState) {
            saveToCache(CACHE_KEYS.RITUAL_STATE, dbState);
            saveToCache(CACHE_KEYS.RITUAL_DATE, today);
            return dbState;
          }
        } catch (err) {
          console.error('Error fetching from DB:', err);
        }
      }

      // If no state exists, return empty state
      const emptyState: MorningRitualState = {
        date: today,
        rituals: {
          wisdom: false,
          breathwork: false,
          gratitude: false,
          affirmations: false
        },
        userId: user?.id || '',
        last_updated: new Date().toISOString()
      };
      saveToCache(CACHE_KEYS.RITUAL_STATE, emptyState);
      saveToCache(CACHE_KEYS.RITUAL_DATE, today);
      return emptyState;
    } catch (err) {
      console.error('Error in syncRitualState:', err);
      return null;
    }
  };

  // Save ritual state
  const saveRitualState = async (ritualState: MorningRitualState) => {
    try {
      // Save to cache immediately
      saveToCache(CACHE_KEYS.RITUAL_STATE, ritualState);
      saveToCache(CACHE_KEYS.RITUAL_DATE, ritualState.date);

      // If online and user is logged in, save to DB
      if (user && isOnline) {
        try {
          const savedState = await ritualService.saveRitualState(ritualState);
          // Update cache with the saved state from DB
          if (savedState) {
            saveToCache(CACHE_KEYS.RITUAL_STATE, savedState);
            saveToCache(CACHE_KEYS.RITUAL_DATE, savedState.date);
            
            // If any ritual is completed, update streak
            if (hasAnyRitualCompleted(savedState.rituals)) {
              await syncStreak();
            }
            
            return savedState;
          }
        } catch (err) {
          console.error('Error saving to DB:', err);
          throw err;
        }
      }

      return ritualState;
    } catch (err) {
      console.error('Error in saveRitualState:', err);
      throw err;
    }
  };

  // Cache-Aside pattern for streak data
  const syncStreak = async () => {
    try {
      // Check cache first
      const cachedStreak = loadFromCache(CACHE_KEYS.STREAK);
      if (cachedStreak && isCacheValid()) {
        return cachedStreak.data;
      }

      // If no local data and online, fetch from DB
      if (user && isOnline) {
        try {
          const dbStreak = await ritualService.updateStreak();
          const ritualState = await syncRitualState();
          
          // If any ritual is completed, increment streak
          if (ritualState && hasAnyRitualCompleted(ritualState.rituals)) {
            const streakData = { 
              current_streak: dbStreak.current_streak,
              last_completed: dbStreak.last_completed,
              last_updated: dbStreak.last_updated
            };
            saveToCache(CACHE_KEYS.STREAK, streakData);
            return streakData;
          }
          
          saveToCache(CACHE_KEYS.STREAK, dbStreak);
          return dbStreak;
        } catch (err) {
          console.error('Error fetching streak from DB:', err);
        }
      }

      return { current_streak: 0, last_completed: null, last_updated: null };
    } catch (err) {
      console.error('Error in syncStreak:', err);
      return { current_streak: 0, last_completed: null, last_updated: null };
    }
  };

  // Initial sync when component mounts
  useEffect(() => {
    const initializeSync = async () => {
      setIsLoading(true);
      try {
        // Cache-Aside pattern for initial load
        const [ritualState, streakData] = await Promise.all([
          syncRitualState(),
          syncStreak()
        ]);

        // No need to modify streak here as syncStreak already handles it
      } catch (err) {
        console.error('Initial sync failed:', err);
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    initializeSync();
  }, [user]);

  return {
    isLoading,
    error,
    isOnline,
    syncRitualState,
    saveRitualState,
    syncStreak
  };
}; 