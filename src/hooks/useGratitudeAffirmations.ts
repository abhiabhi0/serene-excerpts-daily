
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

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
  const [gratitudeList, setGratitudeList] = useState<string[]>(() => 
    getStoredData("userGratitude")
  );
  const [affirmationList, setAffirmationList] = useState<string[]>(() => 
    getStoredData("userAffirmation")
  );
  const [newGratitude, setNewGratitude] = useState("");
  const [newAffirmation, setNewAffirmation] = useState("");
  const { toast } = useToast();

  const saveToStorage = (key: string, data: string[]) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
      toast({
        variant: "destructive",
        title: "Storage Error",
        description: "Failed to save your data. Please try again.",
      });
    }
  };

  const handleAddGratitude = () => {
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
      saveToStorage("userGratitude", updatedList);
      setNewGratitude("");
      toast({
        description: "Gratitude added successfully",
      });
    }
  };

  const handleAddAffirmation = () => {
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
      saveToStorage("userAffirmation", updatedList);
      setNewAffirmation("");
      toast({
        description: "Affirmation added successfully",
      });
    }
  };

  const handleRemoveGratitude = (index: number) => {
    const updatedList = gratitudeList.filter((_, i) => i !== index);
    setGratitudeList(updatedList);
    saveToStorage("userGratitude", updatedList);
    toast({
      description: "Gratitude removed successfully",
    });
  };

  const handleRemoveAffirmation = (index: number) => {
    const updatedList = affirmationList.filter((_, i) => i !== index);
    setAffirmationList(updatedList);
    saveToStorage("userAffirmation", updatedList);
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
  };
};
