
import { useQuery } from "@tanstack/react-query";
import { getRandomExcerpt } from "@/services/excerptService";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { LocalExcerpts } from "@/components/LocalExcerpts";
import { ExcerptWithMeta } from "@/types/excerpt";
import { LocalExcerpt } from "@/types/localExcerpt";
import { TabsContainer } from "@/components/excerpt/TabsContainer";
import { RandomExcerptsTab } from "@/components/excerpt/RandomExcerptsTab";
import { BackgroundSlideshow } from "@/components/background/BackgroundSlideshow";
import { useTabNavigation } from "@/hooks/useTabNavigation";
import { useLocalExcerpts } from "@/hooks/useLocalExcerpts";
import { ExcerptCard } from "@/components/ExcerptCard";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  // Initialize all hooks first
  const { toast } = useToast();
  const { localExcerpts, setLocalExcerpts } = useLocalExcerpts();
  const { activeTab, setActiveTab, setSearchParams } = useTabNavigation();
  const [currentExcerpt, setCurrentExcerpt] = useState<ExcerptWithMeta | null>(null);
  const [isScreenshotMode, setIsScreenshotMode] = useState(false);
  const isMobile = useIsMobile();
  const [isScreenTooSmall, setIsScreenTooSmall] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const { data: remoteExcerpt, refetch: refetchRemote, isLoading, isError } = useQuery({
    queryKey: ["excerpt", selectedLanguages],
    queryFn: () => getRandomExcerpt(selectedLanguages),
    enabled: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
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

  const getRandomLocalExcerpt = (): ExcerptWithMeta | null => {
    if (localExcerpts.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * localExcerpts.length);
    const localExcerpt = localExcerpts[randomIndex];
    return convertLocalToExcerptWithMeta(localExcerpt);
  };

  const convertLocalToExcerptWithMeta = (local: LocalExcerpt): ExcerptWithMeta => ({
    text: local.text,
    bookTitle: local.bookTitle,
    bookAuthor: local.bookAuthor,
    translator: local.translator,
    isLocal: true
  });

  const handleNewExcerpt = (languages?: string[]) => {
    if (languages !== undefined) {
      setSelectedLanguages(languages);
    }
    
    if (Math.random() > 0.7 && localExcerpts.length > 0) {
      const localExcerpt = getRandomLocalExcerpt();
      if (localExcerpt) {
        setCurrentExcerpt(localExcerpt);
        return;
      }
    }
    refetchRemote();
  };

  const handleSelectExcerpt = (excerpt: LocalExcerpt) => {
    setCurrentExcerpt(convertLocalToExcerptWithMeta(excerpt));
    setSearchParams({ tab: 'random' });
  };

  // Effect hooks
  useEffect(() => {
    if (remoteExcerpt) {
      setCurrentExcerpt(remoteExcerpt);
    }
  }, [remoteExcerpt]);

  useEffect(() => {
    // Initial load - only fetch once when component mounts
    if (!currentExcerpt && !isLoading && !isError) {
      handleNewExcerpt();
    }
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsScreenTooSmall(window.innerWidth < 320);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Render content based on screen size
  const renderContent = () => {
    if (isScreenTooSmall && !isMobile) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Screen Too Small</h2>
            <p>Please use a device with a larger screen for the best experience.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen p-4 relative">
        <BackgroundSlideshow />
        
        <div className="container max-w-2xl mx-auto pt-8 flex flex-col gap-8 relative z-10">
          <Tabs value={activeTab} onValueChange={(value) => {
            setActiveTab(value);
            setSearchParams({ tab: value });
          }} className="w-full">
            <TabsContainer activeTab={activeTab} />
            <TabsContent value="random">
              <RandomExcerptsTab 
                currentExcerpt={currentExcerpt}
                isLoading={isLoading}
                handleNewExcerpt={handleNewExcerpt}
              />
            </TabsContent>
            <TabsContent value="local">
              <LocalExcerpts 
                onSelectForDisplay={handleSelectExcerpt}
                localExcerpts={localExcerpts}
                setLocalExcerpts={setLocalExcerpts}
              />
            </TabsContent>
          </Tabs>
        </div>
        <footer className={`mt-8 pb-4 text-center relative z-10 transition-opacity duration-300 ${isScreenshotMode ? 'opacity-0' : 'opacity-100'}`}>
          <a 
            href="https://www.termsfeed.com/live/cecc03b1-3815-4a4e-b8f8-015d7679369d" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Privacy Policy
          </a>
        </footer>
      </div>
    );
  };

  return renderContent();
};

export default Index;
