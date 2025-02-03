import { useQuery } from "@tanstack/react-query";
import { getRandomExcerpt } from "@/services/excerptService";
import { ExcerptCard } from "@/components/ExcerptCard";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

const Index = () => {
  const { toast } = useToast();
  
  const { data: excerpt, refetch, isLoading, isError } = useQuery({
    queryKey: ["excerpt"],
    queryFn: getRandomExcerpt,
    retry: 2,
  });

  const handleNewExcerpt = () => {
    refetch();
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
    <div className="min-h-screen p-4 bg-gradient-to-br from-primary/50 to-secondary/50">
      <div className="container max-w-2xl mx-auto pt-8 flex flex-col gap-8">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-40 bg-white/50 rounded-lg"></div>
            <div className="h-20 bg-white/50 rounded-lg"></div>
          </div>
        ) : excerpt ? (
          <>
            <ExcerptCard 
              excerpt={excerpt} 
              onNewExcerpt={handleNewExcerpt}
            />
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Index;