import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CollapsibleList } from "./CollapsibleList";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const GratitudeAffirmations = () => {
  const [openGratitude, setOpenGratitude] = useState(false);
  const [openAffirmation, setOpenAffirmation] = useState(false);
  const [gratitudes, setGratitudes] = useState<string[]>([]);
  const [affirmations, setAffirmations] = useState<string[]>([]);
  const [newGratitude, setNewGratitude] = useState('');
  const [newAffirmation, setNewAffirmation] = useState('');
  const { user } = useAuth();

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, [user]);

  const loadInitialData = async () => {
    if (user) {
      // Try to get data from DB first
      const { data, error } = await supabase
        .from('user_practice_data')
        .select('gratitudes, affirmations')
        .eq('user_id', user.id)
        .single();

      console.log('DB Data:', data);
      console.log('DB Error:', error);

      if (error) {
        console.error('Error loading from DB:', error);
      } else if (data) {
        // Ensure we're treating the data as arrays
        const gratitudeArray = Array.isArray(data.gratitudes) ? data.gratitudes : [];
        const affirmationArray = Array.isArray(data.affirmations) ? data.affirmations : [];
        
        console.log('Setting gratitudes:', gratitudeArray);
        console.log('Setting affirmations:', affirmationArray);
        
        setGratitudes(gratitudeArray);
        setAffirmations(affirmationArray);
        return;
      }
    }

    // If no DB data or not logged in, try local storage
    const savedGratitudes = localStorage.getItem('gratitudes');
    const savedAffirmations = localStorage.getItem('affirmations');
    
    if (savedGratitudes) setGratitudes(JSON.parse(savedGratitudes));
    if (savedAffirmations) setAffirmations(JSON.parse(savedAffirmations));
  };

  const saveData = async (newGratitudes: string[], newAffirmations: string[]) => {
    // Always save to local storage
    localStorage.setItem('gratitudes', JSON.stringify(newGratitudes));
    localStorage.setItem('affirmations', JSON.stringify(newAffirmations));
    localStorage.setItem('last_updated', new Date().toISOString());

    // If user is logged in, save to DB
    if (user) {
      try {
        // First check if a record exists
        const { data: existingData } = await supabase
          .from('user_practice_data')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (existingData) {
          // Update existing record
          await supabase
            .from('user_practice_data')
            .update({
              gratitudes: newGratitudes,
              affirmations: newAffirmations,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);
        } else {
          // Insert new record
          await supabase
            .from('user_practice_data')
            .insert({
              user_id: user.id,
              gratitudes: newGratitudes,
              affirmations: newAffirmations,
              updated_at: new Date().toISOString()
            });
        }
      } catch (error) {
        console.error('Error saving to DB:', error);
      }
    }
  };

  const handleAddGratitude = async () => {
    if (!newGratitude.trim()) return;
    const updatedGratitudes = [...gratitudes, newGratitude.trim()];
    setGratitudes(updatedGratitudes);
    setNewGratitude('');
    await saveData(updatedGratitudes, affirmations);
  };

  const handleAddAffirmation = async () => {
    if (!newAffirmation.trim()) return;
    const updatedAffirmations = [...affirmations, newAffirmation.trim()];
    setAffirmations(updatedAffirmations);
    setNewAffirmation('');
    await saveData(gratitudes, updatedAffirmations);
  };

  const handleRemoveGratitude = async (index: number) => {
    const updatedGratitudes = gratitudes.filter((_, i) => i !== index);
    setGratitudes(updatedGratitudes);
    await saveData(updatedGratitudes, affirmations);
  };

  const handleRemoveAffirmation = async (index: number) => {
    const updatedAffirmations = affirmations.filter((_, i) => i !== index);
    setAffirmations(updatedAffirmations);
    await saveData(gratitudes, updatedAffirmations);
  };

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
            items={affirmations}
            isOpen={openAffirmation}
            onOpenChange={setOpenAffirmation}
            inputValue={newAffirmation}
            onInputChange={(value: string) => setNewAffirmation(value)}
            onAdd={handleAddAffirmation}
            onRemove={handleRemoveAffirmation}
            inputPlaceholder="I am..."
          />
        </CardContent>
      </Card>
    </div>
  );
};

