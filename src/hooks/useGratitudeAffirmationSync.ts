import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Define cache keys
const CACHE_KEYS = {
  GRATITUDES: 'av_gratitudes',
  AFFIRMATIONS: 'av_affirmations',
  LAST_UPDATED: 'av_practice_last_updated',
  LAST_SYNC: 'av_practice_last_sync',
}

// Define sync interval (5 minutes)
const SYNC_INTERVAL = 5 * 60 * 1000;

export const useGratitudeAffirmationSync = () => {
  const [gratitudes, setGratitudes] = useState<string[]>([]);
  const [affirmations, setAffirmations] = useState<string[]>([]);
  const [newGratitude, setNewGratitude] = useState('');
  const [newAffirmation, setNewAffirmation] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Save data to cache
  const saveToCache = useCallback((
    grts: string[], 
    affs: string[], 
    lastUpdated = new Date().toISOString()
  ) => {
    if (!user) return; // Don't save to cache if user is not logged in
    
    try {
      console.log(`[${new Date().toISOString()}] Saving to cache - Gratitudes: ${grts.length}, Affirmations: ${affs.length}`);
      
      localStorage.setItem(CACHE_KEYS.GRATITUDES, JSON.stringify(grts));
      localStorage.setItem(CACHE_KEYS.AFFIRMATIONS, JSON.stringify(affs));
      localStorage.setItem(CACHE_KEYS.LAST_UPDATED, lastUpdated);
      localStorage.setItem(CACHE_KEYS.LAST_SYNC, new Date().toISOString());
      
      console.log(`[${new Date().toISOString()}] Successfully saved to cache`);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error saving to cache:`, error);
    }
  }, [user]);

  // Load data from cache
  const loadFromCache = useCallback(() => {
    if (!user) return { gratitudes: [], affirmations: [], lastUpdated: new Date().toISOString() }; // Return empty data if user is not logged in
    
    try {
      const cachedGratitudes = localStorage.getItem(CACHE_KEYS.GRATITUDES);
      const cachedAffirmations = localStorage.getItem(CACHE_KEYS.AFFIRMATIONS);
      
      if (cachedGratitudes) setGratitudes(JSON.parse(cachedGratitudes));
      if (cachedAffirmations) setAffirmations(JSON.parse(cachedAffirmations));
      
      return {
        gratitudes: cachedGratitudes ? JSON.parse(cachedGratitudes) : [],
        affirmations: cachedAffirmations ? JSON.parse(cachedAffirmations) : [],
        lastUpdated: localStorage.getItem(CACHE_KEYS.LAST_UPDATED) || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error loading from cache:', error);
      return { gratitudes: [], affirmations: [], lastUpdated: new Date().toISOString() };
    }
  }, [user]);

  // Save data to DB
  const saveToDB = useCallback(async (
    grts: string[], 
    affs: string[], 
    lastUpdated = new Date().toISOString()
  ) => {
    if (!user) return null;

    try {
      console.log(`[${new Date().toISOString()}] Attempting to save to DB`);
      
      const { data, error } = await supabase
        .from('user_practice_data')
        .upsert({
          user_id: user.id,
          gratitudes: grts,
          affirmations: affs,
          updated_at: lastUpdated
        }, {
          onConflict: 'user_id'
        })
        .select();

      if (error) {
        console.error(`[${new Date().toISOString()}] Error saving to DB:`, error);
        throw error;
      }

      console.log(`[${new Date().toISOString()}] Successfully saved to DB`);
      return data;
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error in saveToDB:`, error);
      return null;
    }
  }, [user]);

  // Load data from DB
  const loadFromDB = useCallback(async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_practice_data')
        .select('gratitudes, affirmations, updated_at')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error loading from DB:', error);
      return null;
    }
  }, [user]);

  // Sync data between cache and DB
  const syncData = useCallback(async (force = false) => {
    if (!user && !force) return;
    
    try {
      setIsSyncing(true);
      console.log(`[${new Date().toISOString()}] Starting sync process`);
      
      // Get last sync time
      const lastSync = localStorage.getItem(CACHE_KEYS.LAST_SYNC);
      const now = new Date().getTime();
      
      // Skip sync if not forced and last sync was less than SYNC_INTERVAL ago
      if (!force && lastSync && (now - new Date(lastSync).getTime()) < SYNC_INTERVAL) {
        console.log(`[${new Date().toISOString()}] Skipping sync - Last sync was too recent`);
        setIsSyncing(false);
        return;
      }
      
      // Get data from cache and DB
      const cacheData = loadFromCache();
      console.log(`[${new Date().toISOString()}] Cache data loaded`);
      
      const dbData = await loadFromDB();
      console.log(`[${new Date().toISOString()}] DB data loaded`);
      
      // Check if this is first time sync after sign up
      const isFirstTimeSync = localStorage.getItem('is_first_time_sync') === null;
      
      // If user is logged in and has data in DB, always prioritize DB data
      if (user && dbData) {
        console.log(`[${new Date().toISOString()}] User logged in with DB data, updating cache`);
        const dbGratitudes = Array.isArray(dbData.gratitudes) ? dbData.gratitudes : [];
        const dbAffirmations = Array.isArray(dbData.affirmations) ? dbData.affirmations : [];
        
        setGratitudes(dbGratitudes);
        setAffirmations(dbAffirmations);
        saveToCache(dbGratitudes, dbAffirmations, dbData.updated_at);
        setIsSyncing(false);
        return;
      }
      
      // If user is logged in but no DB data, and this is first time sync after sign up
      if (user && !dbData && isFirstTimeSync && (cacheData.gratitudes.length > 0 || cacheData.affirmations.length > 0)) {
        console.log(`[${new Date().toISOString()}] First time sync after sign up, using cache data`);
        await saveToDB(cacheData.gratitudes, cacheData.affirmations, cacheData.lastUpdated);
        localStorage.setItem('is_first_time_sync', 'false');
        setIsSyncing(false);
        return;
      }
      
      // If no data in both sources, nothing to sync
      if (!dbData && (!cacheData.gratitudes.length && !cacheData.affirmations.length)) {
        console.log(`[${new Date().toISOString()}] No data to sync in either source`);
        setIsSyncing(false);
        return;
      }
      
      // If data only in cache and not first time sync, update DB
      if (!dbData && (cacheData.gratitudes.length > 0 || cacheData.affirmations.length > 0) && !isFirstTimeSync) {
        console.log(`[${new Date().toISOString()}] Updating DB with cache data`);
        await saveToDB(cacheData.gratitudes, cacheData.affirmations, cacheData.lastUpdated);
        setIsSyncing(false);
        return;
      }
      
      // If data only in DB, update cache
      if (dbData && (!cacheData.gratitudes.length && !cacheData.affirmations.length)) {
        console.log(`[${new Date().toISOString()}] Updating cache with DB data`);
        const dbGratitudes = Array.isArray(dbData.gratitudes) ? dbData.gratitudes : [];
        const dbAffirmations = Array.isArray(dbData.affirmations) ? dbData.affirmations : [];
        
        setGratitudes(dbGratitudes);
        setAffirmations(dbAffirmations);
        saveToCache(dbGratitudes, dbAffirmations, dbData.updated_at);
        setIsSyncing(false);
        return;
      }
      
      // If data in both sources, compare timestamps and sync accordingly
      if (dbData && (cacheData.gratitudes.length > 0 || cacheData.affirmations.length > 0)) {
        const cacheTimestamp = new Date(cacheData.lastUpdated).getTime();
        const dbTimestamp = new Date(dbData.updated_at).getTime();
        
        console.log(`[${new Date().toISOString()}] Comparing timestamps`);
        
        if (cacheTimestamp > dbTimestamp && !isFirstTimeSync) {
          console.log(`[${new Date().toISOString()}] Cache is newer, updating DB`);
          await saveToDB(cacheData.gratitudes, cacheData.affirmations, cacheData.lastUpdated);
        } else if (dbTimestamp > cacheTimestamp) {
          console.log(`[${new Date().toISOString()}] DB is newer, updating cache`);
          const dbGratitudes = Array.isArray(dbData.gratitudes) ? dbData.gratitudes : [];
          const dbAffirmations = Array.isArray(dbData.affirmations) ? dbData.affirmations : [];
          
          setGratitudes(dbGratitudes);
          setAffirmations(dbAffirmations);
          saveToCache(dbGratitudes, dbAffirmations, dbData.updated_at);
        }
      }
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error in sync process:`, error);
    } finally {
      setIsSyncing(false);
      console.log(`[${new Date().toISOString()}] Sync process completed`);
    }
  }, [user, loadFromCache, loadFromDB, saveToDB, saveToCache]);

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      
      // Always load from cache first for quick loading
      loadFromCache();
      
      // Then sync with DB in the background
      await syncData(true);
      
      setIsLoading(false);
    };
    
    loadInitialData();
  }, [loadFromCache, syncData]);

  // Setup periodic sync
  useEffect(() => {
    if (!user) return;
    
    const syncInterval = setInterval(() => {
      syncData();
    }, SYNC_INTERVAL);
    
    return () => clearInterval(syncInterval);
  }, [user, syncData]);

  // Sync on user changes (login/logout)
  useEffect(() => {
    syncData(true);
  }, [user, syncData]);

  // Handle adding a gratitude
  const addGratitude = async () => {
    if (!newGratitude.trim() || !user) return; // Don't add if user is not logged in
    
    try {
      const now = new Date().toISOString();
      const updatedGratitudes = [...gratitudes, newGratitude.trim()];
      
      // Update local state
      setGratitudes(updatedGratitudes);
      setNewGratitude('');
      
      // Update cache
      saveToCache(updatedGratitudes, affirmations, now);
      
      // Update DB if user is logged in
      if (user) {
        await saveToDB(updatedGratitudes, affirmations, now);
      }
      
      toast({
        description: "Gratitude added successfully",
      });
    } catch (error) {
      console.error('Error adding gratitude:', error);
      toast({
        variant: "destructive",
        title: "Error adding gratitude",
        description: "Please try again",
      });
    }
  };

  // Handle adding an affirmation
  const addAffirmation = async () => {
    if (!newAffirmation.trim() || !user) return; // Don't add if user is not logged in
    
    try {
      const now = new Date().toISOString();
      const updatedAffirmations = [...affirmations, newAffirmation.trim()];
      
      // Update local state
      setAffirmations(updatedAffirmations);
      setNewAffirmation('');
      
      // Update cache
      saveToCache(gratitudes, updatedAffirmations, now);
      
      // Update DB if user is logged in
      if (user) {
        await saveToDB(gratitudes, updatedAffirmations, now);
      }
      
      toast({
        description: "Affirmation added successfully",
      });
    } catch (error) {
      console.error('Error adding affirmation:', error);
      toast({
        variant: "destructive",
        title: "Error adding affirmation",
        description: "Please try again",
      });
    }
  };

  // Handle removing a gratitude
  const removeGratitude = async (index: number) => {
    if (!user) return; // Don't remove if user is not logged in
    
    try {
      const now = new Date().toISOString();
      const updatedGratitudes = gratitudes.filter((_, i) => i !== index);
      
      // Update local state
      setGratitudes(updatedGratitudes);
      
      // Update cache
      saveToCache(updatedGratitudes, affirmations, now);
      
      // Update DB if user is logged in
      if (user) {
        await saveToDB(updatedGratitudes, affirmations, now);
      }
      
      toast({
        description: "Gratitude removed successfully",
      });
    } catch (error) {
      console.error('Error removing gratitude:', error);
      toast({
        variant: "destructive",
        title: "Error removing gratitude",
        description: "Please try again",
      });
    }
  };

  // Handle removing an affirmation
  const removeAffirmation = async (index: number) => {
    if (!user) return; // Don't remove if user is not logged in
    
    try {
      const now = new Date().toISOString();
      const updatedAffirmations = affirmations.filter((_, i) => i !== index);
      
      // Update local state
      setAffirmations(updatedAffirmations);
      
      // Update cache
      saveToCache(gratitudes, updatedAffirmations, now);
      
      // Update DB if user is logged in
      if (user) {
        await saveToDB(gratitudes, updatedAffirmations, now);
      }
      
      toast({
        description: "Affirmation removed successfully",
      });
    } catch (error) {
      console.error('Error removing affirmation:', error);
      toast({
        variant: "destructive",
        title: "Error removing affirmation",
        description: "Please try again",
      });
    }
  };

  return {
    gratitudes,
    affirmations,
    newGratitude,
    newAffirmation,
    setNewGratitude,
    setNewAffirmation,
    addGratitude,
    addAffirmation,
    removeGratitude,
    removeAffirmation,
    isLoading,
    isSyncing,
    syncData
  };
};
