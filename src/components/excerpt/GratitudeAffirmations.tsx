import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CollapsibleList } from "./CollapsibleList";
import { useGratitudeAffirmationSync } from '@/hooks/useGratitudeAffirmationSync';
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from '@/context/AuthContext';

export const GratitudeAffirmations = () => {
  const [openGratitude, setOpenGratitude] = useState(false);
  const [openAffirmation, setOpenAffirmation] = useState(false);
  const { user } = useAuth();
  
  const {
    gratitudes,
    affirmations,
    newGratitude,
    newAffirmation,
    setNewGratitude,
    setNewAffirmation,
    addGratitude,
    addAffirmation,
    removeGratitude,
    removeAffirmation,
    isLoading
  } = useGratitudeAffirmationSync();

  if (isLoading) {
    return (
      <div className="my-4 py-8 flex justify-center items-center">
        <Spinner size="md" />
      </div>
    );
  }

  return (
    <div className="space-y-4 my-4">
      <Card className="w-full bg-[#F2FCE2]/20 border-[#1A4067]/30 backdrop-blur-sm">
        <CardContent className="pt-6">
          <CollapsibleList
            title="🙏 Appreciate Life: Write Your Gratitudes"
            items={gratitudes}
            isOpen={openGratitude}
            onOpenChange={setOpenGratitude}
            inputValue={newGratitude}
            onInputChange={(value: string) => setNewGratitude(value)}
            onAdd={addGratitude}
            onRemove={removeGratitude}
            inputPlaceholder="I am grateful for..."
            disabled={!user}
          />
        </CardContent>
      </Card>

      <Card className="w-full bg-[#E5DEFF]/20 border-[#1A4067]/30 backdrop-blur-sm">
        <CardContent className="pt-6">
          <CollapsibleList
            title="✨ Realize Your Divine Nature: Sacred Affirmations"
            items={affirmations}
            isOpen={openAffirmation}
            onOpenChange={setOpenAffirmation}
            inputValue={newAffirmation}
            onInputChange={(value: string) => setNewAffirmation(value)}
            onAdd={addAffirmation}
            onRemove={removeAffirmation}
            inputPlaceholder="I am..."
            disabled={!user}
          />
        </CardContent>
      </Card>
    </div>
  );
};
