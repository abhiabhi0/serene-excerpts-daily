import { useQuery } from "@tanstack/react-query";
import { getRandomExcerpt } from "@/services/excerptService";
import { ExcerptCard } from "@/components/ExcerptCard";
import { ExploreTab } from "@/components/ExploreTab";
import { AddExcerptForm } from "@/components/AddExcerptForm";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Compass } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  
  const { data: excerpt, refetch, isLoading, isError } = useQuery({
    queryKey: ["excerpt"],
    queryFn: getRandomExcerpt,
    retry: 2,
  });

  const handleNewExcerpt = () => {
    refetch();
  };

  const handleAddExcerptClick = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to sign in. Please try again.",
        });
      }
    } else {
      setShowAddForm(true);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-[#0A1929] via-[#0F2942] to-[#1A4067]">
      <div className="container max-w-2xl mx-auto pt-8 flex flex-col gap-8">
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="explore">
              <Compass className="w-4 h-4 mr-2" />
              Explore
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-40 bg-white/5 rounded-lg"></div>
                <div className="h-20 bg-white/5 rounded-lg"></div>
              </div>
            ) : excerpt ? (
              <>
                <ExcerptCard 
                  excerpt={excerpt} 
                  onNewExcerpt={handleNewExcerpt}
                />
                <Button
                  onClick={handleAddExcerptClick}
                  className="w-full mt-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your Excerpt
                </Button>
                {showAddForm && (
                  <div className="mt-4">
                    <AddExcerptForm />
                  </div>
                )}
              </>
            ) : null}
          </TabsContent>

          <TabsContent value="explore">
            <ExploreTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;