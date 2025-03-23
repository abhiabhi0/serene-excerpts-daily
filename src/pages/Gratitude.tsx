
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CollapsibleList } from "@/components/excerpt/CollapsibleList";
import { useGratitudeAffirmationSync } from '@/hooks/useGratitudeAffirmationSync';
import { Spinner } from "@/components/ui/spinner";

const GratitudePage: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  
  const {
    gratitudes,
    newGratitude,
    setNewGratitude,
    addGratitude,
    removeGratitude,
    isLoading
  } = useGratitudeAffirmationSync();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gratitude Practice</h1>
      <div className="bg-white/5 rounded-lg p-6">
        <p className="text-lg mb-6">
          Take a moment to reflect on what you're grateful for today. Expressing gratitude can transform your perspective and bring more joy into your life.
        </p>
        
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <Spinner size="md" />
          </div>
        ) : (
          <Card className="w-full bg-[#F2FCE2]/20 border-[#1A4067]/30 backdrop-blur-sm">
            <CardContent className="pt-6">
              <CollapsibleList
                title="Your Gratitude Journal"
                items={gratitudes}
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                inputValue={newGratitude}
                onInputChange={(value: string) => setNewGratitude(value)}
                onAdd={addGratitude}
                onRemove={removeGratitude}
                inputPlaceholder="I am grateful for..."
              />
            </CardContent>
          </Card>
        )}
        
        <div className="mt-6 text-white/70">
          <h3 className="text-lg font-semibold mb-2">Benefits of Gratitude Practice</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Increases happiness and positive mood</li>
            <li>Reduces stress and anxiety</li>
            <li>Fosters resilience in challenging times</li>
            <li>Improves sleep quality</li>
            <li>Enhances relationships and empathy</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GratitudePage;
