
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const MAX_ITEMS = 5;
const MAX_CHARS = 100;

export const useGratitudeAffirmations = () => {
  const [gratitudeList, setGratitudeList] = useState<string[]>([]);
  const [affirmationList, setAffirmationList] = useState<string[]>([]);
  const [newGratitude, setNewGratitude] = useState("");
  const [newAffirmation, setNewAffirmation] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const savedGratitude = localStorage.getItem("userGratitude");
    const savedAffirmation = localStorage.getItem("userAffirmation");
    if (savedGratitude) setGratitudeList(JSON.parse(savedGratitude));
    if (savedAffirmation) setAffirmationList(JSON.parse(savedAffirmation));
  }, []);

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
      localStorage.setItem("userGratitude", JSON.stringify(updatedList));
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
      localStorage.setItem("userAffirmation", JSON.stringify(updatedList));
      setNewAffirmation("");
      toast({
        description: "Affirmation added successfully",
      });
    }
  };

  const handleRemoveGratitude = (index: number) => {
    const updatedList = gratitudeList.filter((_, i) => i !== index);
    setGratitudeList(updatedList);
    localStorage.setItem("userGratitude", JSON.stringify(updatedList));
    toast({
      description: "Gratitude removed successfully",
    });
  };

  const handleRemoveAffirmation = (index: number) => {
    const updatedList = affirmationList.filter((_, i) => i !== index);
    setAffirmationList(updatedList);
    localStorage.setItem("userAffirmation", JSON.stringify(updatedList));
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

