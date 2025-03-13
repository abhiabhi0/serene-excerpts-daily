
import { Suspense } from "react";
import { LocalExcerpt } from "@/types/localExcerpt";
import { LoadingCard } from "./LoadingCard";
import { lazy } from "react";

const LocalExcerpts = lazy(() => 
  Promise.all([
    import('../LocalExcerpts').then(module => ({ default: module.LocalExcerpts })),
    new Promise(resolve => setTimeout(resolve, 100))
  ]).then(([module]) => module)
);

interface LocalExcerptsTabProps {
  localExcerpts: LocalExcerpt[];
  setLocalExcerpts: (excerpts: LocalExcerpt[]) => void;
  onSelectExcerpt: (excerpt: LocalExcerpt) => void;
}

export const LocalExcerptsTab = ({ 
  localExcerpts, 
  setLocalExcerpts, 
  onSelectExcerpt 
}: LocalExcerptsTabProps) => {
  return (
    <Suspense fallback={<LoadingCard />}>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <LocalExcerpts 
          onSelectForDisplay={onSelectExcerpt}
          localExcerpts={localExcerpts}
          setLocalExcerpts={setLocalExcerpts}
        />
      </div>
    </Suspense>
  );
};
