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
            <div className="text-center text-sm text-muted-foreground">
              <p>Excerpt - Daily Book Excerpts</p>
              <p className="mt-1">Available on Google Play Store</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 text-center">
              <h2 className="text-lg font-semibold mb-4">Support Excerpt</h2>
              <div className="flex flex-col items-center gap-4">
                <QRCodeSVG 
                  value="upi://pay?pa=razorpay-handle@upi" 
                  size={150}
                  className="mb-2"
                />
                <p className="text-sm text-muted-foreground">
                  Scan QR code or visit{' '}
                  <a 
                    href="https://razorpay.me/your-handle" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    razorpay.me/your-handle
                  </a>
                </p>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Index;