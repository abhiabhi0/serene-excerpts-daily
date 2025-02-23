
import { lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRandomExcerpt } from "@/services/excerptService";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ExcerptWithMeta } from "@/types/excerpt";
import { LocalExcerpt } from "@/types/localExcerpt";
import { TabsContainer } from "@/components/excerpt/TabsContainer";
import { useTabNavigation } from "@/hooks/useTabNavigation";
import { useLocalExcerpts } from "@/hooks/useLocalExcerpts";
import { useIsMobile } from "@/hooks/use-mobile";
import Footer from '../components/Footer';

// Lazy load components with proper type annotations
const ExcerptCard = lazy(() => import('../components/ExcerptCard').then(module => ({ default: module.ExcerptCard })));
const LocalExcerpts = lazy(() => import('../components/LocalExcerpts').then(module => ({ default: module.LocalExcerpts })));

// Loading fallback
const LoadingCard = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-40 bg-white/5 rounded-lg"></div>
    <div className="h-20 bg-white/5 rounded-lg"></div>
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

  const { data: remoteExcerpt, refetch: refetchRemote, isLoading, isError } = useQuery({
    queryKey: ["excerpt"],
    queryFn: getRandomExcerpt,
    enabled: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    gcTime: 30 * 60 * 1000, // Modern replacement for cacheTime
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

  useEffect(() => {
    if (remoteExcerpt) {
      setCurrentExcerpt(remoteExcerpt);
    }
  }, [remoteExcerpt]);

  useEffect(() => {
    let mounted = true;
    
    if (!currentExcerpt && mounted) {
      handleNewExcerpt();
    }

    return () => {
      mounted = false;
    };
  }, []);

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
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Screen Too Small</h2>
            <p className="text-base">Please use a device with a larger screen for the best experience.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen p-4 relative bg-[#0A1929]">
        <div className="container max-w-[clamp(16rem,90vw,42rem)] mx-auto pt-8 flex flex-col gap-4 md:gap-8 relative z-10">
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
                {currentExcerpt && (
                  <ExcerptCard 
                    excerpt={currentExcerpt}
                    onNewExcerpt={handleNewExcerpt}
                    onScreenshotModeChange={setIsScreenshotMode}
                  />
                )}
                {isLoading && <LoadingCard />}
                {isError && !currentExcerpt && (
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <p className="text-red-400 mb-2">Unable to load excerpt</p>
                    <button 
                      onClick={() => refetchRemote()} 
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </Suspense>
            </TabsContent>
            <TabsContent value="local" className="mt-4">
              <Suspense fallback={<LoadingCard />}>
                <LocalExcerpts 
                  onSelectForDisplay={handleSelectExcerpt}
                  localExcerpts={localExcerpts}
                  setLocalExcerpts={setLocalExcerpts}
                />
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

// Simple debounce utility
const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export default Index;
