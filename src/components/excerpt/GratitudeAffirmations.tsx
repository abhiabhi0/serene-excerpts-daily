
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useGratitudeAffirmations } from "@/hooks/useGratitudeAffirmations";
import { CollapsibleList } from "./CollapsibleList";

export const GratitudeAffirmations = () => {
  const [openGratitude, setOpenGratitude] = useState(false);
  const [openAffirmation, setOpenAffirmation] = useState(false);
  
  const {
    gratitudeList,
    affirmationList,
    newGratitude,
    newAffirmation,
    handleAddGratitude,
    handleAddAffirmation,
    handleRemoveGratitude,
    handleRemoveAffirmation,
    handleGratitudeChange,
    handleAffirmationChange,
  } = useGratitudeAffirmations();

  return (
    <div className="space-y-4 my-4">
      <Card className="w-full bg-[#F2FCE2]/20 border-[#1A4067]/30 backdrop-blur-sm">
        <CardContent className="pt-6">
          <CollapsibleList
            title="🙏 Appreciate Life: Write Your Gratitudes"
            items={gratitudeList}
            isOpen={openGratitude}
            onOpenChange={setOpenGratitude}
            inputValue={newGratitude}
            onInputChange={handleGratitudeChange}
            onAdd={handleAddGratitude}
            onRemove={handleRemoveGratitude}
            inputPlaceholder="I am grateful for..."
          />
        </CardContent>
      </Card>

      <Card className="w-full bg-[#E5DEFF]/20 border-[#1A4067]/30 backdrop-blur-sm">
        <CardContent className="pt-6">
          <CollapsibleList
            title="✨ Realize Your Divine Nature: Sacred Affirmations"
            items={affirmationList}
            isOpen={openAffirmation}
            onOpenChange={setOpenAffirmation}
            inputValue={newAffirmation}
            onInputChange={handleAffirmationChange}
            onAdd={handleAddAffirmation}
            onRemove={handleRemoveAffirmation}
            inputPlaceholder="I am..."
          />
        </CardContent>
      </Card>
    </div>
  );
};

