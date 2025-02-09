
import { useQuery } from "@tanstack/react-query";
import { getRandomExcerpt, getAllBookTitles } from "@/services/excerptService";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LocalExcerpts } from "@/components/LocalExcerpts";
import { TabsContainer } from "@/components/excerpt/TabsContainer";
import { BackgroundSlideshow } from "@/components/background/BackgroundSlideshow";
import { useTabNavigation } from "@/hooks/useTabNavigation";
import { useLocalExcerpts } from "@/hooks/useLocalExcerpts";
import { ExcerptCard } from "@/components/ExcerptCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { TransformedExcerpt } from "@/utils/excerptTransformer";

const Index = () => {
  const { toast } = useToast();
  const { localExcerpts, setLocalExcerpts } = useLocalExcerpts();
  const { activeTab, setActiveTab, setSearchParams } = useTabNavigation();
  const [currentExcerpt, setCurrentExcerpt] = useState<TransformedExcerpt | null>(null);
  const [isScreenshotMode, setIsScreenshotMode] = useState(false);
  const isMobile = useIsMobile();
  const [isScreenTooSmall, setIsScreenTooSmall] = useState(false);
  const [selectedBook, setSelectedBook] = useState<string>("");

  const { data: bookTitles } = useQuery({
    queryKey: ["bookTitles"],
    queryFn: getAllBookTitles,
    staleTime: Infinity,
  });

  const { refetch: refetchExcerpt } = useQuery({
    queryKey: ["excerpt", selectedBook],
    queryFn: getRandomExcerpt,
    enabled: false,
    onSuccess: (data) => {
      if (!selectedBook || data.bookTitle === selectedBook) {
        setCurrentExcerpt(data);
      } else {
        refetchExcerpt();
      }
    },
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

  const handleNewExcerpt = () => {
    refetchExcerpt();
  };

  useEffect(() => {
    if (!currentExcerpt) {
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
          {bookTitles && bookTitles.length > 0 && (
            <div className="w-full">
              <Select value={selectedBook} onValueChange={setSelectedBook}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by book" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Books</SelectItem>
                  {bookTitles.map((title) => (
                    <SelectItem key={title} value={title}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={(value) => {
            setActiveTab(value);
            setSearchParams({ tab: value });
          }} className="w-full">
            <TabsContainer activeTab={activeTab} />
            <TabsContent value="random">
              {currentExcerpt && (
                <ExcerptCard 
                  excerpt={currentExcerpt}
                  onNewExcerpt={handleNewExcerpt}
                  onScreenshotModeChange={setIsScreenshotMode}
                />
              )}
            </TabsContent>
            <TabsContent value="local">
              <LocalExcerpts 
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
