import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRandomExcerpt, preloadExcerpts } from "@/services/excerptService";
import { ExcerptWithMeta } from "@/types/excerpt";
import { LocalExcerpt } from "@/types/localExcerpt";
import { useToast } from "@/components/ui/use-toast";

export const useExcerptData = () => {
  const { toast } = useToast();
  const [currentExcerpt, setCurrentExcerpt] = useState<ExcerptWithMeta | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [isPreloading, setIsPreloading] = useState(true);
  
  // Query for initial excerpt
  const { 
    data: remoteExcerpt, 
    refetch: refetchRemote, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ["excerpt", selectedTheme],
    queryFn: () => getRandomExcerpt(selectedTheme),
    enabled: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    gcTime: 30 * 60 * 1000, // Cache for 30 minutes
    staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
    meta: {
      onError: () => {
        console.error("Failed to fetch excerpt");
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Please check your internet connection and try again.",
        });
      }
    }
  });

  // Preload data in the background
  useEffect(() => {
    const preload = async () => {
      try {
        await preloadExcerpts();
      } finally {
        setIsPreloading(false);
      }
    };
    preload();
  }, []);

  const handleNewExcerpt = () => {
    refetchRemote();
  };

  const handleThemeSelect = (theme: string | null) => {
    console.log('Theme selection changed to:', theme ? `"${theme}"` : 'null (All)');
    setSelectedTheme(theme);
    setCurrentExcerpt(null);
    setTimeout(() => refetchRemote(), 0);
  };

  const convertLocalToExcerptWithMeta = (local: LocalExcerpt): ExcerptWithMeta => ({
    text: local.text,
    bookTitle: local.bookTitle,
    isLocal: true
  });

  // Load initial excerpt
  useEffect(() => {
    const loadInitialExcerpt = async () => {
      if (!currentExcerpt && !isLoading) {
        console.log('Initial data load with theme:', selectedTheme ? `"${selectedTheme}"` : 'null (All)');
        await refetchRemote();
      }
    };
    loadInitialExcerpt();
  }, []);

  // Update current excerpt when remote data changes
  useEffect(() => {
    if (remoteExcerpt) {
      console.log('Setting current excerpt with theme:', selectedTheme ? `"${selectedTheme}"` : 'null (All)');
      setCurrentExcerpt(remoteExcerpt);
    }
  }, [remoteExcerpt]);

  return {
    currentExcerpt,
    setCurrentExcerpt,
    remoteExcerpt,
    refetchRemote,
    isLoading,
    isError,
    selectedTheme,
    handleNewExcerpt,
    handleThemeSelect,
    convertLocalToExcerptWithMeta,
    isPreloading
  };
};
