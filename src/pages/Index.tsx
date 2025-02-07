
import { useQuery } from "@tanstack/react-query";
import { getRandomExcerpt } from "@/services/excerptService";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { LocalExcerpts } from "@/components/LocalExcerpts";
import { ExcerptWithMeta } from "@/types/excerpt";
import { LocalExcerpt } from "@/types/localExcerpt";
import { useSearchParams } from "react-router-dom";
import { TabsContainer } from "@/components/excerpt/TabsContainer";
import { RandomExcerptsTab } from "@/components/excerpt/RandomExcerptsTab";
import { useGesture } from "@use-gesture/react";

const backgroundImages = [
  'https://images.unsplash.com/photo-1528319725582-ddc096101511', // Person meditating in nature
  'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc', // Sunset meditation
  'https://images.unsplash.com/photo-1508672019048-805c876b67e2', // Buddha statue
  'https://images.unsplash.com/photo-1531685250784-7569952593d2', // Zen stones
  'https://images.unsplash.com/photo-1499209974431-9dddcece7f88', // Peaceful forest
  'https://images.unsplash.com/photo-1600585152220-90363fe7e115', // Lotus flower
];

const Index = () => {
  const { toast } = useToast();
  const [localExcerpts, setLocalExcerpts] = useState<LocalExcerpt[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'random');
  const [currentExcerpt, setCurrentExcerpt] = useState<ExcerptWithMeta | null>(null);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Background image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Bind swipe gestures
  useGesture(
    {
      onDrag: ({ direction: [dx], distance: [dist] }) => {
        if (dist < 50) return; // Minimum swipe distance
        
        if (dx > 0 && activeTab === 'random') {
          // Right swipe on Today's Wisdom -> go to My Collection
          setActiveTab('local');
          setSearchParams({ tab: 'local' });
        } else if (dx < 0 && activeTab === 'local') {
          // Left swipe on My Collection -> go to Today's Wisdom
          setActiveTab('random');
          setSearchParams({ tab: 'random' });
        }
      }
    },
    {
      target: window,
      eventOptions: { passive: false },
    }
  );

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);
  
  // Load local excerpts from localStorage
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

  const { data: remoteExcerpt, refetch: refetchRemote, isLoading, isError } = useQuery({
    queryKey: ["excerpt"],
    queryFn: getRandomExcerpt,
    retry: 2,
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

  const handleNewExcerpt = () => {
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

  useEffect(() => {
    if (remoteExcerpt) {
      setCurrentExcerpt(remoteExcerpt);
    }
  }, [remoteExcerpt]);

  useEffect(() => {
    if (isError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load excerpt. Please try again.",
      });
    }
  }, [isError, toast]);

  return (
    <div className="min-h-screen p-4 relative">
      {/* Background image with overlay */}
      <div 
        className="fixed inset-0 transition-opacity duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${backgroundImages[currentBgIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.25, // Increased opacity for better visibility
        }}
      />
      {/* Gradient overlay */}
      <div 
        className="fixed inset-0"
        style={{
          background: 'linear-gradient(to bottom right, rgba(10, 25, 41, 0.90), rgba(15, 41, 66, 0.90), rgba(26, 64, 103, 0.90))',
          zIndex: 1,
        }}
      />
      
      {/* Content */}
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
      <footer className="mt-8 pb-4 text-center relative z-10">
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

export default Index;
