
import { ExcerptWithMeta } from "@/types/excerpt";
import { Share } from '@capacitor/share';
import { useToast } from "@/components/ui/use-toast";

export const useShareHandler = (excerpt: ExcerptWithMeta) => {
  const { toast } = useToast();

  const handleShare = async () => {
    const websiteUrl = "https://atmanamviddhi.in";
    const attribution = excerpt.bookTitle || excerpt.bookAuthor || '';
    const shareText = `${excerpt.text}\n\n~ ${attribution}\n\n${websiteUrl}`;

    try {
      // First copy to clipboard
      await navigator.clipboard.writeText(shareText);
      toast({
        title: "Text copied to clipboard",
        description: "You can now paste and share it anywhere",
      });

      // Then show share dialog
      await Share.share({
        text: shareText,
        dialogTitle: 'Share Excerpt',
      });
    } catch (error) {
      console.error("Sharing failed:", error);
      // Even if share dialog fails, clipboard copy might have worked
      // Only show error if clipboard copy also failed
      if (!navigator.clipboard) {
        toast({
          title: "Sharing failed", 
          description: "Unable to share at this time",
          variant: "destructive",
        });
      }
    }
  };

  return { handleShare };
};
