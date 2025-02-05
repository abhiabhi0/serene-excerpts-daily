import { useQuery } from "@tanstack/react-query";
import { getRandomExcerpt } from "@/services/excerptService";
import { ExcerptCard } from "@/components/ExcerptCard";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocalExcerpts } from "@/components/LocalExcerpts";
import { ExcerptWithMeta } from "@/types/excerpt";
import { LocalExcerpt } from "@/types/localExcerpt";

const Index = () => {
  const { toast } = useToast();
  const [localExcerpts, setLocalExcerpts] = useState<LocalExcerpt[]>([]);
  
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

  const [currentExcerpt, setCurrentExcerpt] = useState<ExcerptWithMeta | null>(null);

  useEffect(() => {
    if (remoteExcerpt) {
      setCurrentExcerpt(remoteExcerpt);
    }
  }, [remoteExcerpt]);

  const handleSelectExcerpt = (excerpt: LocalExcerpt) => {
    setCurrentExcerpt(convertLocalToExcerptWithMeta(excerpt));
  };

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
        <Tabs defaultValue="random" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="random">Random Excerpts</TabsTrigger>
            <TabsTrigger value="local">My Excerpts</TabsTrigger>
          </TabsList>
          <TabsContent value="random">
            <div className="relative">
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-40 bg-white/5 rounded-lg"></div>
                  <div className="h-20 bg-white/5 rounded-lg"></div>
                </div>
              ) : currentExcerpt ? (
                <ExcerptCard 
                  excerpt={currentExcerpt} 
                  onNewExcerpt={handleNewExcerpt} 
                />
              ) : null}
            </div>
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