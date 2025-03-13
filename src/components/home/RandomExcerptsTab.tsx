
import { Suspense, useState } from "react";
import { ExcerptWithMeta } from "@/types/excerpt";
import { LoadingCard } from "./LoadingCard";
import { lazy } from "react";

const ExcerptCard = lazy(() => 
  Promise.all([
    import('../ExcerptCard').then(module => ({ default: module.ExcerptCard })),
    new Promise(resolve => setTimeout(resolve, 100))
  ]).then(([module]) => module)
);

interface RandomExcerptsTabProps {
  currentExcerpt: ExcerptWithMeta | null;
  isLoading: boolean;
  isError: boolean;
  onNewExcerpt: () => void;
  onScreenshotModeChange: (mode: boolean) => void;
  refetchRemote: () => void;
}

export const RandomExcerptsTab = ({ 
  currentExcerpt, 
  isLoading, 
  isError,
  onNewExcerpt,
  onScreenshotModeChange,
  refetchRemote
}: RandomExcerptsTabProps) => {
  return (
    <Suspense fallback={<LoadingCard />}>
      <div className="transition-all duration-300 ease-in-out">
        {currentExcerpt && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <ExcerptCard 
              excerpt={currentExcerpt}
              onNewExcerpt={onNewExcerpt}
              onScreenshotModeChange={onScreenshotModeChange}
            />
          </div>
        )}
        {isLoading && <LoadingCard />}
        {isError && !currentExcerpt && (
          <div className="text-center p-4 bg-white/5 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-500">
            <p className="text-red-400 mb-2">Unable to load excerpt</p>
            <button 
              onClick={() => refetchRemote()} 
              className="text-blue-400 hover:text-blue-300"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </Suspense>
  );
};
