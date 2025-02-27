
import { lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRandomExcerpt } from "@/services/excerptService";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ExcerptWithMeta } from "@/types/excerpt";
import { LocalExcerpt } from "@/types/localExcerpt";
import { TabsContainer } from "@/components/TabsContainer";
import { useTabNavigation } from "@/hooks/useTabNavigation";
import { useLocalExcerpts } from "@/hooks/useLocalExcerpts";
import { useIsMobile } from "@/hooks/use-mobile";
import Footer from '../components/Footer';
//import { ThemeSelector } from "@/components/ThemeSelector";
import { availableThemes } from "@/data/staticData";

const ExcerptCard = lazy(() => 
  Promise.all([
    import('../components/ExcerptCard').then(module => ({ default: module.ExcerptCard })),
    new Promise(resolve => setTimeout(resolve, 100))
  ]).then(([module]) => module)
);

const LocalExcerpts = lazy(() => 
  Promise.all([
    import('../components/LocalExcerpts').then(module => ({ default: module.LocalExcerpts })),
    new Promise(resolve => setTimeout(resolve, 100))
  ]).then(([module]) => module)
);

const LoadingCard = () => (
  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-4">
    <div className="h-40 bg-white/5 rounded-lg animate-pulse">
      <div className="h-full w-full bg-gradient-to-r from-white/[0.05] to-white/[0.08] background-animate" />
    </div>
    <div className="h-20 bg-white/5 rounded-lg animate-pulse">
      <div className="h-full w-full bg-gradient-to-r from-white/[0.05] to-white/[0.08] background-animate" />
    </div>
  </div>
);

const Index = () => {
  const { toast } = useToast();
  const { localExcerpts, setLocalExcerpts } = useLocalExcerpts();
  const { activeTab, setActiveTab, setSearchParams } = useTabNavigation();
  const [currentExcerpt, setCurrentExcerpt] = useState<ExcerptWithMeta | null>(null);
  const [isScreenshotMode, setIsScreenshotMode] = useState(false);
  const isMobile = useIsMobile();
  const [isScreenTooSmall, setIsScreenTooSmall] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const { data: remoteExcerpt, refetch: refetchRemote, isLoading, isError } = useQuery({
    queryKey: ["excerpt", selectedTheme],
    queryFn: () => getRandomExcerpt(selectedTheme),
    enabled: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
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

  const convertLocalToExcerptWithMeta = (local: LocalExcerpt): ExcerptWithMeta => ({
    text: local.text,
    bookTitle: local.bookTitle,
    isLocal: true
  });

  const handleNewExcerpt = () => {
    refetchRemote();
  };

  const handleSelectExcerpt = (excerpt: LocalExcerpt) => {
    setCurrentExcerpt(convertLocalToExcerptWithMeta(excerpt));
    setSearchParams({ tab: 'random' });
  };

  const handleThemeSelect = (theme: string | null) => {
    setSelectedTheme(theme);
    setCurrentExcerpt(null);
    refetchRemote();
  };

  useEffect(() => {
    const preloadData = async () => {
      if (!currentExcerpt) {
        await refetchRemote();
      }
    };
    preloadData();
  }, []);

  useEffect(() => {
    if (remoteExcerpt) {
      setCurrentExcerpt(remoteExcerpt);
    }
  }, [remoteExcerpt]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsScreenTooSmall(window.innerWidth < 320);
    };
    
    const debouncedCheck = debounce(checkScreenSize, 100);
    checkScreenSize();
    
    window.addEventListener('resize', debouncedCheck);
    return () => window.removeEventListener('resize', debouncedCheck);
  }, []);

  const renderContent = () => {
    if (isScreenTooSmall && !isMobile) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-xl font-semibold mb-2">Screen Too Small</h2>
            <p className="text-base">Please use a device with a larger screen for the best experience.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen p-4 relative bg-[#0A1929]">
        <div className="container max-w-[clamp(16rem,90vw,42rem)] mx-auto pt-8 flex flex-col gap-4 md:gap-8 relative z-10">
          {/* <ThemeSelector 
            themes={availableThemes} 
            selectedTheme={selectedTheme} 
            onThemeSelect={handleThemeSelect}
          /> */}
          
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => {
              setActiveTab(value);
              setSearchParams({ tab: value });
            }} 
            className="w-full"
          >
            <TabsContainer activeTab={activeTab} />
            <TabsContent value="random" className="mt-4">
              <Suspense fallback={<LoadingCard />}>
                <div className="transition-all duration-300 ease-in-out">
                  {currentExcerpt && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <ExcerptCard 
                        excerpt={currentExcerpt}
                        onNewExcerpt={handleNewExcerpt}
                        onScreenshotModeChange={setIsScreenshotMode}
                      />
                    </div>
                  )}
                  {isLoading && <LoadingCard />}
                  {isError && !currentExcerpt && (
                    <div className="text-center p-4 bg-white/5 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <p className="text-red-400 mb-2">Unable to load excerpt</p>
                      <button 
                        onClick={() => refetchRemote()} 
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              </Suspense>
            </TabsContent>
            <TabsContent value="local" className="mt-4">
              <Suspense fallback={<LoadingCard />}>
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <LocalExcerpts 
                    onSelectForDisplay={handleSelectExcerpt}
                    localExcerpts={localExcerpts}
                    setLocalExcerpts={setLocalExcerpts}
                  />
                </div>
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
        <Footer />
      </div>
    );
  };

  return renderContent();
};

const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export default Index;
