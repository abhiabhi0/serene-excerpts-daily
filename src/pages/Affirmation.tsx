
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CollapsibleList } from "@/components/excerpt/CollapsibleList";
import { useGratitudeAffirmationSync } from '@/hooks/useGratitudeAffirmationSync';
import { Spinner } from "@/components/ui/spinner";

const AffirmationPage: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  
  const {
    affirmations,
    newAffirmation,
    setNewAffirmation,
    addAffirmation,
    removeAffirmation,
    isLoading
  } = useGratitudeAffirmationSync();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Daily Affirmations</h1>
      <div className="bg-white/5 rounded-lg p-6">
        <p className="text-lg mb-6">
          Practice positive self-talk and affirmations to cultivate a mindset of growth and possibility. These statements help reprogram your subconscious mind and align your thoughts with your highest self.
        </p>
        
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <Spinner size="md" />
          </div>
        ) : (
          <Card className="w-full bg-[#E5DEFF]/20 border-[#1A4067]/30 backdrop-blur-sm">
            <CardContent className="pt-6">
              <CollapsibleList
                title="Your Sacred Affirmations"
                items={affirmations}
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                inputValue={newAffirmation}
                onInputChange={(value: string) => setNewAffirmation(value)}
                onAdd={addAffirmation}
                onRemove={removeAffirmation}
                inputPlaceholder="I am..."
              />
            </CardContent>
          </Card>
        )}
        
        <div className="mt-6 text-white/70">
          <h3 className="text-lg font-semibold mb-2">Tips for Effective Affirmations</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Use present tense - "I am" rather than "I will be"</li>
            <li>Make them positive - focus on what you want, not what you don't</li>
            <li>Keep them specific but concise</li>
            <li>Include emotion to make them more powerful</li>
            <li>Repeat them daily, ideally morning and evening</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AffirmationPage;
