import { ExcerptCard } from "@/components/ExcerptCard";
import { ExcerptWithMeta } from "@/types/excerpt";

interface RandomExcerptsTabProps {
  currentExcerpt: ExcerptWithMeta | null;
  isLoading: boolean;
  handleNewExcerpt: () => void;
}

export const RandomExcerptsTab = ({ 
  currentExcerpt, 
  isLoading, 
  handleNewExcerpt 
}: RandomExcerptsTabProps) => {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-40 bg-white/5 rounded-lg"></div>
        <div className="h-20 bg-white/5 rounded-lg"></div>
      </div>
    );
  }

  return currentExcerpt ? (
    <ExcerptCard 
      excerpt={currentExcerpt} 
      onNewExcerpt={handleNewExcerpt} 
    />
  ) : null;
};