
import { useQuery } from "@tanstack/react-query";
import { getRandomExcerpt } from "@/services/excerptService";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { LocalExcerpts } from "@/components/LocalExcerpts";
import { ExcerptWithMeta } from "@/types/excerpt";
import { LocalExcerpt } from "@/types/localExcerpt";
import { TabsContainer } from "@/components/excerpt/TabsContainer";
import { BackgroundSlideshow } from "@/components/background/BackgroundSlideshow";
import { useTabNavigation } from "@/hooks/useTabNavigation";
import { useLocalExcerpts } from "@/hooks/useLocalExcerpts";
import { ExcerptCard } from "@/components/ExcerptCard";
import { useIsMobile } from "@/hooks/use-mobile";
import Footer from '../components/Footer'; // Adjust the path as necessary
import { NotificationService } from '@/services/notificationService';
import { Button } from '@/components/ui/button';
import { Bell } from "lucide-react";
const Index = () => {
  const { toast } = useToast();
  const { localExcerpts, setLocalExcerpts } = useLocalExcerpts();
  const { activeTab, setActiveTab, setSearchParams } = useTabNavigation();
  const [currentExcerpt, setCurrentExcerpt] = useState<ExcerptWithMeta | null>(null);
  const [isScreenshotMode, setIsScreenshotMode] = useState(false);
  const isMobile = useIsMobile();
  const [isScreenTooSmall, setIsScreenTooSmall] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const { data: remoteExcerpt, refetch: refetchRemote, isLoading, isError } = useQuery({
    queryKey: ["excerpt"],
    queryFn: getRandomExcerpt,
    enabled: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
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
    const handleEnableNotifications = async () => {
      const granted = await NotificationService.requestPermission();
      if (granted) {
        setNotificationsEnabled(true);
        NotificationService.scheduleDailyNotification();
        toast({
          title: "Notifications Enabled",
          description: "You'll receive daily wisdom reminders at 11:11 AM",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Notification Permission Denied",
          description: "Please enable notifications in your browser settings.",
        });
      }
    };

    useEffect(() => {
      NotificationService.initialize();

      // Check if notifications are already enabled
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
        NotificationService.scheduleDailyNotification();
      }
    }, []);
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
      console.log("Fetched remote excerpt:", remoteExcerpt); // Add this line
      setCurrentExcerpt(remoteExcerpt);
    }
  }, [remoteExcerpt]);

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
        {!notificationsEnabled && (
            <div className="text-center mb-4">
              <Button 
                variant="outline" 
                onClick={handleEnableNotifications}
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
              >
                <Bell className="w-4 h-4 mr-2" />
                Enable Daily Wisdom Notifications
              </Button>
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
              {isLoading && (
                <div className="animate-pulse space-y-4">
                  <div className="h-40 bg-white/5 rounded-lg"></div>
                  <div className="h-20 bg-white/5 rounded-lg"></div>
                </div>
              )}
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
        <Footer />
      </div>
    );
  };

  return renderContent();
};

export default Index;
