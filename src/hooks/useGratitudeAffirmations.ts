
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

const MAX_ITEMS = 5;
const MAX_CHARS = 100;

const getStoredData = (key: string): string[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return [];
  }
};

export const useGratitudeAffirmations = () => {
  const [gratitudeList, setGratitudeList] = useState<string[]>([]);
  const [affirmationList, setAffirmationList] = useState<string[]>([]);
  const [newGratitude, setNewGratitude] = useState("");
  const [newAffirmation, setNewAffirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load data on component mount or when user changes
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      if (user) {
        try {
          // Fetch from Supabase
          const { data, error } = await supabase
            .from('user_practice_data')
            .select('gratitudes, affirmations')
            .eq('user_id', user.id)
            .single();
            
          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching data from Supabase:', error);
            // Fallback to localStorage if Supabase fetch fails
            setGratitudeList(getStoredData("userGratitude"));
            setAffirmationList(getStoredData("userAffirmation"));
          } else if (data) {
            setGratitudeList(data.gratitudes || []);
            setAffirmationList(data.affirmations || []);
          } else {
            // No data in Supabase yet, check localStorage and sync it
            const localGratitudes = getStoredData("userGratitude");
            const localAffirmations = getStoredData("userAffirmation");
            
            setGratitudeList(localGratitudes);
            setAffirmationList(localAffirmations);
            
            // Sync localStorage data to Supabase if we have any
            if (localGratitudes.length > 0 || localAffirmations.length > 0) {
              await supabase.from('user_practice_data').upsert({
                user_id: user.id,
                gratitudes: localGratitudes,
                affirmations: localAffirmations,
                updated_at: new Date().toISOString()
              });
            }
          }
        } catch (error) {
          console.error('Error in loadData:', error);
          // Fallback to localStorage
          setGratitudeList(getStoredData("userGratitude"));
          setAffirmationList(getStoredData("userAffirmation"));
        }
      } else {
        // Use localStorage when not logged in
        setGratitudeList(getStoredData("userGratitude"));
        setAffirmationList(getStoredData("userAffirmation"));
      }
      
      setIsLoading(false);
    };
    
    loadData();
  }, [user]);

  const saveToStorage = async (key: string, data: string[]) => {
    try {
      // Always save to localStorage for offline access
      localStorage.setItem(key, JSON.stringify(data));
      
      // If user is logged in, also save to Supabase
      if (user) {
        const payload = key === "userGratitude" 
          ? { gratitudes: data }
          : { affirmations: data };
          
        const { error } = await supabase
          .from('user_practice_data')
          .upsert({
            user_id: user.id,
            ...payload,
            updated_at: new Date().toISOString()
          });
          
        if (error) {
          console.error(`Error saving ${key} to Supabase:`, error);
          throw error;
        }
      }
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      toast({
        variant: "destructive",
        title: "Storage Error",
        description: "Failed to save your data. Please try again.",
      });
    }
  };

  const handleAddGratitude = async () => {
    if (gratitudeList.length >= MAX_ITEMS) {
      toast({
        description: "You can only add up to 5 gratitudes",
        variant: "destructive",
      });
      return;
    }
    if (newGratitude.trim()) {
      const updatedList = [...gratitudeList, newGratitude];
      setGratitudeList(updatedList);
      await saveToStorage("userGratitude", updatedList);
      setNewGratitude("");
      toast({
        description: "Gratitude added successfully",
      });
    }
  };

  const handleAddAffirmation = async () => {
    if (affirmationList.length >= MAX_ITEMS) {
      toast({
        description: "You can only add up to 5 affirmations",
        variant: "destructive",
      });
      return;
    }
    if (newAffirmation.trim()) {
      const updatedList = [...affirmationList, newAffirmation];
      setAffirmationList(updatedList);
      await saveToStorage("userAffirmation", updatedList);
      setNewAffirmation("");
      toast({
        description: "Affirmation added successfully",
      });
    }
  };

  const handleRemoveGratitude = async (index: number) => {
    const updatedList = gratitudeList.filter((_, i) => i !== index);
    setGratitudeList(updatedList);
    await saveToStorage("userGratitude", updatedList);
    toast({
      description: "Gratitude removed successfully",
    });
  };

  const handleRemoveAffirmation = async (index: number) => {
    const updatedList = affirmationList.filter((_, i) => i !== index);
    setAffirmationList(updatedList);
    await saveToStorage("userAffirmation", updatedList);
    toast({
      description: "Affirmation removed successfully",
    });
  };

  const handleGratitudeChange = (value: string) => {
    if (value.length <= MAX_CHARS) {
      setNewGratitude(value);
    } else {
      toast({
        description: `Maximum ${MAX_CHARS} characters allowed`,
        variant: "destructive",
      });
    }
  };

  const handleAffirmationChange = (value: string) => {
    if (value.length <= MAX_CHARS) {
      setNewAffirmation(value);
    } else {
      toast({
        description: `Maximum ${MAX_CHARS} characters allowed`,
        variant: "destructive",
      });
    }
  };

  return {
    gratitudeList,
    affirmationList,
    newGratitude,
    newAffirmation,
    handleAddGratitude,
    handleAddAffirmation,
    handleRemoveGratitude,
    handleRemoveAffirmation,
    handleGratitudeChange,
    handleAffirmationChange,
    isLoading
  };
};
