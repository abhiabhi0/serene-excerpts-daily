
import { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { LocalExcerpt } from "@/types/localExcerpt";
import { TabsContainer } from "@/components/TabsContainer";
import { useTabNavigation } from "@/hooks/useTabNavigation";
import { useLocalExcerpts } from "@/hooks/useLocalExcerpts";
import { useIsMobile } from "@/hooks/use-mobile";
import Footer from '../components/Footer';
import { ThemeSelector } from "@/components/ThemeSelector";
import { availableThemes } from "@/data/staticData";
import { RandomExcerptsTab } from "@/components/home/RandomExcerptsTab";
import { LocalExcerptsTab } from "@/components/home/LocalExcerptsTab";
import { useExcerptData } from "@/hooks/useExcerptData";
import { Button } from "@/components/ui/button";
import { Wind } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const { localExcerpts, setLocalExcerpts } = useLocalExcerpts();
  const { activeTab, setActiveTab, setSearchParams } = useTabNavigation();
  const [isScreenshotMode, setIsScreenshotMode] = useState(false);
  const isMobile = useIsMobile();
  const [isScreenTooSmall, setIsScreenTooSmall] = useState(false);
  
  const {
    currentExcerpt,
    setCurrentExcerpt,
    refetchRemote,
    isLoading,
    isError,
    selectedTheme,
    handleNewExcerpt,
    handleThemeSelect,
    convertLocalToExcerptWithMeta
  } = useExcerptData();

  const handleSelectExcerpt = (excerpt: LocalExcerpt) => {
    setCurrentExcerpt(convertLocalToExcerptWithMeta(excerpt));
    setSearchParams({ tab: 'random' });
  };

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
          <div className="flex justify-between items-center">
            <ThemeSelector 
              themes={availableThemes} 
              selectedTheme={selectedTheme} 
              onThemeSelect={handleThemeSelect}
            />
          </div>
          
          <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-700/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium mb-1">One Minute Breathwork</h3>
                <p className="text-sm text-white/70">Take a short breathing break to re-center your mind</p>
              </div>
              <Link to="/breathwork">
                <Button variant="secondary" className="w-full md:w-auto flex items-center gap-2">
                  <Wind size={16} /> Start Breathing
                </Button>
              </Link>
            </div>
          </div>
        
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
              <RandomExcerptsTab
                currentExcerpt={currentExcerpt}
                isLoading={isLoading}
                isError={isError}
                onNewExcerpt={handleNewExcerpt}
                onScreenshotModeChange={setIsScreenshotMode}
                refetchRemote={refetchRemote}
              />
            </TabsContent>
            <TabsContent value="local" className="mt-4">
              <LocalExcerptsTab 
                localExcerpts={localExcerpts}
                setLocalExcerpts={setLocalExcerpts}
                onSelectExcerpt={handleSelectExcerpt}
              />
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
