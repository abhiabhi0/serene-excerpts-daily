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

const Index = () => {
  const { toast } = useToast();
  const [localExcerpts, setLocalExcerpts] = useState<LocalExcerpt[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'random');
  const [currentExcerpt, setCurrentExcerpt] = useState<ExcerptWithMeta | null>(null);

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
  
  useEffect(() => {
    const saved = localStorage.getItem("localExcerpts");
    if (saved) {
      setLocalExcerpts(JSON.parse(saved));
    }
  }, []);

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
    <div className="min-h-screen p-4 bg-gradient-to-br from-[#0A1929] via-[#0F2942] to-[#1A4067]">
      <div className="container max-w-2xl mx-auto pt-8 flex flex-col gap-8">
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
            <LocalExcerpts onSelectForDisplay={handleSelectExcerpt} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;