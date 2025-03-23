
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { ChecklistItem, MorningRitualState } from './types';
import { useStreakManagement } from './useStreakManagement';

// Create a dedicated cache name for morning ritual data
const CACHE_NAME = 'morning-ritual-data-v1';

export const useMorningRitual = (userId: string | undefined) => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const {
    streak,
    loadStreak,
    checkAndUpdateStreak,
    updateStreakBasedOnCompletion,
    loadLocalStreak,
    checkAndUpdateLocalStreak
  } = useStreakManagement(userId);

  // Load data from cache first for immediate display
  const loadFromCache = useCallback(async () => {
    try {
      const cache = await caches.open(CACHE_NAME);
      const response = await cache.match('morningRitual');
      
      if (response) {
        const data = await response.json();
        setItems(data.items || []);
        setLastUpdated(data.lastUpdated || null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading from cache:', error);
      return false;
    }
  }, []);

  // Save data to cache
  const saveToCache = useCallback(async (newItems: ChecklistItem[]) => {
    try {
      const timestamp = new Date().toISOString();
      const cache = await caches.open(CACHE_NAME);
      const data: MorningRitualState = {
        items: newItems,
        lastUpdated: timestamp
      };
      
      const response = new Response(JSON.stringify(data));
      await cache.put('morningRitual', response);
      setLastUpdated(timestamp);
      
      return timestamp;
    } catch (error) {
      console.error('Error saving to cache:', error);
      return null;
    }
  }, []);

  // Load data from Supabase
  const loadFromDatabase = useCallback(async () => {
    if (!userId) return null;
    
    try {
      const { data, error } = await supabase
        .from('user_practice_data')
        .select('data, last_updated')
        .eq('user_id', userId)
        .eq('data_type', 'morning_ritual')
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error loading from database:', error);
        return null;
      }
      
      if (data) {
        setItems(data.data.items || []);
        setLastUpdated(data.last_updated);
        return data.last_updated;
      }
      
      return null;
    } catch (error) {
      console.error('Error in loadFromDatabase:', error);
      return null;
    }
  }, [userId]);

  // Save data to Supabase
  const saveToDatabase = useCallback(async (newItems: ChecklistItem[]) => {
    if (!userId) return null;
    
    try {
      const timestamp = new Date().toISOString();
      
      const { error } = await supabase
        .from('user_practice_data')
        .upsert({
          user_id: userId,
          data_type: 'morning_ritual',
          data: { items: newItems },
          last_updated: timestamp
        });
        
      if (error) {
        console.error('Error saving to database:', error);
        return null;
      }
      
      setLastUpdated(timestamp);
      return timestamp;
    } catch (error) {
      console.error('Error in saveToDatabase:', error);
      return null;
    }
  }, [userId]);

  // Sync data between cache and database
  const syncData = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    
    try {
      // If logged in, check which is newer - cache or database
      if (userId) {
        const dbLastUpdated = await loadFromDatabase();
        const cacheLoaded = await loadFromCache();
        
        if (dbLastUpdated && cacheLoaded && lastUpdated) {
          // Compare timestamps and use the most recent data
          const dbDate = new Date(dbLastUpdated).getTime();
          const cacheDate = new Date(lastUpdated).getTime();
          
          if (dbDate > cacheDate) {
            // Database is newer, already loaded in loadFromDatabase
            await saveToCache(items); // Update cache with DB data
          } else if (cacheDate > dbDate) {
            // Cache is newer
            await saveToDatabase(items); // Update DB with cache data
          }
        } else if (dbLastUpdated) {
          // Only database has data
          await saveToCache(items);
        } else if (cacheLoaded && items.length > 0) {
          // Only cache has data
          await saveToDatabase(items);
        } else {
          // Initialize with empty data
          const newItems: ChecklistItem[] = [];
          await saveToCache(newItems);
          await saveToDatabase(newItems);
        }
        
        // Load streak data
        await loadStreak();
      } else {
        // Not logged in, use cache only
        const cacheLoaded = await loadFromCache();
        if (!cacheLoaded) {
          const newItems: ChecklistItem[] = [];
          await saveToCache(newItems);
        }
        
        // Load local streak data
        loadLocalStreak();
      }
    } catch (error) {
      console.error('Error syncing data:', error);
    } finally {
      setIsSyncing(false);
      setIsLoading(false);
    }
  }, [userId, items, lastUpdated, isSyncing, loadFromCache, loadFromDatabase, saveToCache, saveToDatabase, loadStreak, loadLocalStreak]);

  // Initial load
  useEffect(() => {
    syncData();
    
    // Set up periodic sync (every 5 minutes)
    const syncInterval = setInterval(() => {
      syncData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(syncInterval);
  }, [syncData]);

  // Add a new item
  const addItem = useCallback(async () => {
    if (!newItemText.trim()) return;
    
    const newItem: ChecklistItem = {
      id: uuidv4(),
      text: newItemText.trim(),
      checked: false
    };
    
    const newItems = [...items, newItem];
    setItems(newItems);
    setNewItemText('');
    
    // Save immediately to cache for responsive UI
    await saveToCache(newItems);
    
    // Also save to database if logged in
    if (userId) {
      await saveToDatabase(newItems);
    }
  }, [newItemText, items, saveToCache, saveToDatabase, userId]);

  // Toggle item checked state
  const toggleItem = useCallback(async (id: string) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    
    setItems(newItems);
    
    // Update cache immediately
    await saveToCache(newItems);
    
    // Check if all items are completed
    const allCompleted = newItems.every(item => item.checked);
    
    // Update streak based on completion status
    if (userId) {
      // Update database
      await saveToDatabase(newItems);
      
      // Check and update streak if needed
      if (allCompleted) {
        await checkAndUpdateStreak(newItems);
      }
    } else {
      // Local storage streak management
      checkAndUpdateLocalStreak(newItems);
    }
  }, [items, saveToCache, saveToDatabase, userId, checkAndUpdateStreak, checkAndUpdateLocalStreak]);

  // Remove an item
  const removeItem = useCallback(async (id: string) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    
    // Update cache immediately
    await saveToCache(newItems);
    
    // Also update database if logged in
    if (userId) {
      await saveToDatabase(newItems);
    }
  }, [items, saveToCache, saveToDatabase, userId]);

  // Reset all items (uncheck all)
  const resetItems = useCallback(async () => {
    const newItems = items.map(item => ({ ...item, checked: false }));
    setItems(newItems);
    
    // Update cache immediately
    await saveToCache(newItems);
    
    // Also update database if logged in
    if (userId) {
      await saveToDatabase(newItems);
      
      // Reset streak to 0 when items are reset
      updateStreakBasedOnCompletion(false);
    } else {
      // Local storage streak management for reset
      checkAndUpdateLocalStreak(newItems);
    }
  }, [items, saveToCache, saveToDatabase, userId, updateStreakBasedOnCompletion, checkAndUpdateLocalStreak]);

  return {
    items,
    newItemText,
    setNewItemText,
    addItem,
    toggleItem,
    removeItem,
    resetItems,
    isLoading,
    streak
  };
};
