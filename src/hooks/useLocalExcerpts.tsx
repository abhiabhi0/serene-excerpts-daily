
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { LocalExcerpt } from "@/types/localExcerpt";

export const useLocalExcerpts = () => {
  const { toast } = useToast();
  const [localExcerpts, setLocalExcerpts] = useState<LocalExcerpt[]>([]);

  useEffect(() => {
    const loadLocalExcerpts = () => {
      const saved = localStorage.getItem("localExcerpts");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setLocalExcerpts(parsed);
          console.log("Loaded local excerpts:", parsed.length);
        } catch (error) {
          console.error("Error parsing local excerpts:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load saved excerpts.",
          });
        }
      }
    };

    loadLocalExcerpts();

    // Listen for storage changes from other tabs/windows
    window.addEventListener('storage', loadLocalExcerpts);
    return () => window.removeEventListener('storage', loadLocalExcerpts);
  }, [toast]);

  return {
    localExcerpts,
    setLocalExcerpts
  };
};
