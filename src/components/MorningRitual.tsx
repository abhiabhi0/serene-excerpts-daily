import { useState, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useRitualSync } from '@/hooks/useRitualSync';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from './AuthModal';

export function MorningRitual() {
  const { user } = useAuth();
  const { updateRitualCompletion, syncStreak } = useRitualSync();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [streak, setStreak] = useState(0);
  const [rituals, setRituals] = useState({
    wisdom: false,
    gratitude: false,
    affirmations: false,
    breathwork: false
  });

  useEffect(() => {
    const loadStreak = async () => {
      const streakData = await syncStreak();
      setStreak(streakData.current_streak);
    };
    loadStreak();
  }, []);

  const handleCheckboxChange = async (ritual: keyof typeof rituals) => {
    const newRituals = { ...rituals, [ritual]: !rituals[ritual] };
    setRituals(newRituals);

    // If user is not signed in, show auth modal
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Check if all rituals are completed
    const allCompleted = Object.values(newRituals).every(completed => completed);
    
    if (allCompleted) {
      const updatedStreak = await updateRitualCompletion(true);
      if (updatedStreak) {
        setStreak(updatedStreak.current_streak);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Morning Ritual</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="wisdom"
              checked={rituals.wisdom}
              onCheckedChange={() => handleCheckboxChange('wisdom')}
            />
            <label htmlFor="wisdom" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Wisdom
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="gratitude"
              checked={rituals.gratitude}
              onCheckedChange={() => handleCheckboxChange('gratitude')}
            />
            <label htmlFor="gratitude" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Gratitude
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="affirmations"
              checked={rituals.affirmations}
              onCheckedChange={() => handleCheckboxChange('affirmations')}
            />
            <label htmlFor="affirmations" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Affirmations
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="breathwork"
              checked={rituals.breathwork}
              onCheckedChange={() => handleCheckboxChange('breathwork')}
            />
            <label htmlFor="breathwork" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Breathwork
            </label>
          </div>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Current streak: {streak} days
        </div>
      </div>

      {!user && (
        <div className="flex justify-center">
          <Button onClick={() => setShowAuthModal(true)}>
            Sign in to track your progress
          </Button>
        </div>
      )}

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
} 