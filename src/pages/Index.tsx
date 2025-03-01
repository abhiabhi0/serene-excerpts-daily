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
  import { ThemeSelector } from "@/components/ThemeSelector";
  import { availableThemes } from "@/data/staticData";
  import { useNotifications } from "@/hooks/useNotifications"; // Import the notifications hook
  
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

    const { isPermissionGranted, requestPermission } = useNotifications();

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
      console.log('Theme selection changed to:', theme ? `"${theme}"` : 'null (All)');
      setSelectedTheme(theme);
      setCurrentExcerpt(null);

      // Pass the theme directly to refetchRemote to avoid closure issues
      setTimeout(() => refetchRemote(), 0);
    };

    useEffect(() => {
      const preloadData = async () => {
        if (!currentExcerpt) {
          console.log('Initial data load with theme:', selectedTheme ? `"${selectedTheme}"` : 'null (All)');
          await refetchRemote();
        }
      };
      preloadData();
    }, []);

    useEffect(() => {
      if (remoteExcerpt) {
        console.log('Setting current excerpt with theme:', selectedTheme ? `"${selectedTheme}"` : 'null (All)');
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

    // Request notification permission after initial data load
    useEffect(() => {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        // Wait a few seconds after loading to ask for permission
        const timer = setTimeout(() => {
          requestPermission();
        }, 3000);
      
        return () => clearTimeout(timer);
      }
    }, []);

    // Render notification prompt if needed
    const renderNotificationPrompt = () => {
      if (!isPermissionGranted && Notification.permission !== 'denied') {
        return (
          <div className="my-4 p-3 bg-white/5 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-500">
            <p className="mb-2">Enable notifications to receive daily wisdom directly to your device</p>
            <button 
              onClick={requestPermission}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors"
            >
              Enable Notifications
            </button>
          </div>
        );
      }
      return null;
    };

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
            <div className="flex justify-between items-center">
              <ThemeSelector 
                themes={availableThemes} 
                selectedTheme={selectedTheme} 
                onThemeSelect={handleThemeSelect}
              />
            </div>
          
            {/* Add notification prompt here */}
            {renderNotificationPrompt()}
      
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