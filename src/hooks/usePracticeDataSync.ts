import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface PracticeData {
  gratitudes: string[];
  affirmations: string[];
  updated_at: string;
}

interface CacheData extends PracticeData {
  last_sync: string;
}

export const usePracticeDataSync = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Function to get data from cache
  const getFromCache = (): CacheData | null => {
    const gratitudes = localStorage.getItem('gratitudes');
    const affirmations = localStorage.getItem('affirmations');
    const lastUpdated = localStorage.getItem('last_updated');
    const lastSync = localStorage.getItem('last_sync');

    if (!gratitudes && !affirmations) return null;

    return {
      gratitudes: gratitudes ? JSON.parse(gratitudes) : [],
      affirmations: affirmations ? JSON.parse(affirmations) : [],
      updated_at: lastUpdated || new Date().toISOString(),
      last_sync: lastSync || new Date().toISOString()
    };
  };

  // Function to save data to cache
  const saveToCache = (data: PracticeData) => {
    localStorage.setItem('gratitudes', JSON.stringify(data.gratitudes));
    localStorage.setItem('affirmations', JSON.stringify(data.affirmations));
    localStorage.setItem('last_updated', data.updated_at);
    localStorage.setItem('last_sync', new Date().toISOString());
  };

  // Function to get data from DB
  const getFromDB = async (): Promise<PracticeData | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_practice_data')
        .select('gratitudes, affirmations, updated_at')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching from DB:', error);
      return null;
    }
  };

  // Function to save data to DB
  const saveToDB = async (data: PracticeData) => {
    if (!user) return null;

    try {
      const { data: savedData, error } = await supabase
        .from('user_practice_data')
        .upsert({
          user_id: user.id,
          gratitudes: data.gratitudes,
          affirmations: data.affirmations,
          updated_at: data.updated_at
        })
        .select()
        .single();

      if (error) throw error;
      return savedData;
    } catch (error) {
      console.error('Error saving to DB:', error);
      return null;
    }
  };

  // Function to sync data
  const syncData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const cacheData = getFromCache();
      const dbData = await getFromDB();

      // If no data in both cache and DB, nothing to sync
      if (!cacheData && !dbData) {
        setIsLoading(false);
        return;
      }

      // If data only in DB, update cache
      if (!cacheData && dbData) {
        saveToCache(dbData);
        setIsLoading(false);
        return;
      }

      // If data only in cache, update DB
      if (cacheData && !dbData) {
        await saveToDB(cacheData);
        setIsLoading(false);
        return;
      }

      // If data in both, compare timestamps and sync accordingly
      if (cacheData && dbData) {
        const cacheTimestamp = new Date(cacheData.updated_at).getTime();
        const dbTimestamp = new Date(dbData.updated_at).getTime();

        if (cacheTimestamp > dbTimestamp) {
          // Cache is newer, update DB
          await saveToDB(cacheData);
        } else if (dbTimestamp > cacheTimestamp) {
          // DB is newer, update cache
          saveToCache(dbData);
        }
      }
    } catch (error) {
      console.error('Error syncing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update practice data
  const updatePracticeData = async (
    type: 'gratitudes' | 'affirmations',
    data: string[]
  ) => {
    const now = new Date().toISOString();
    const currentData = getFromCache() || {
      gratitudes: [],
      affirmations: [],
      updated_at: now,
      last_sync: now
    };

    const newData = {
      ...currentData,
      [type]: data,
      updated_at: now
    };

    // Update cache immediately
    saveToCache(newData);

    // Sync with DB asynchronously
    if (user) {
      syncData();
    }

    return newData;
  };

  // Auto-sync when user logs in or when component mounts
  useEffect(() => {
    if (user) {
      syncData();
    }
  }, [user]);

  return {
    updatePracticeData,
    syncData,
    getFromCache,
    isLoading
  };
}; 