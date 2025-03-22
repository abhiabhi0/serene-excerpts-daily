import { useState, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useRitualSync } from '@/hooks/useRitualSync';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from './AuthModal';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MorningRitualState } from '@/services/ritualService';

type RitualState = MorningRitualState['rituals'];

export function MorningRitual() {
  const { user } = useAuth();
  const { syncStreak, syncRitualState, saveRitualState, isOnline, isLoading, error } = useRitualSync();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [streak, setStreak] = useState(0);
  const [rituals, setRituals] = useState<RitualState>({
    wisdom: false,
    breathwork: false,
    gratitude: false,
    affirmations: false
  });

  // Load initial state
  useEffect(() => {
    const loadInitialState = async () => {
      try {
        const savedState = await syncRitualState();
        if (savedState) {
          setRituals({
            ...savedState.rituals,
            last_updated: savedState.last_updated
          });
          // After setting rituals, sync streak
          const streakData = await syncStreak();
          setStreak(streakData.current_streak);
        }
      } catch (err) {
        console.error('Error loading initial state:', err);
      }
    };

    loadInitialState();
  }, [user]); // Re-run when user changes

  // Reload data when coming back online
  useEffect(() => {
    if (isOnline) {
      const reloadData = async () => {
        try {
          const savedState = await syncRitualState();
          if (savedState) {
            setRituals({
              ...savedState.rituals,
              last_updated: savedState.last_updated
            });
            const streakData = await syncStreak();
            setStreak(streakData.current_streak);
          }
        } catch (err) {
          console.error('Error reloading data:', err);
        }
      };

      reloadData();
    }
  }, [isOnline]);

  // Handle checkbox changes
  const handleCheckboxChange = async (ritual: keyof RitualState) => {
    // Update UI immediately
    const newRituals = {
      ...rituals,
      [ritual]: !rituals[ritual]
    };
    setRituals(newRituals);

    // Show auth modal if not signed in
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      // Save state and get updated streak
      const savedState = await saveRitualState({
        date: new Date().toLocaleDateString(),
        rituals: newRituals,
        userId: user.id,
        last_updated: new Date().toISOString()
      });

      if (savedState) {
        setRituals(savedState.rituals);
        
        // If any ritual is checked, increment streak
        if (newRituals[ritual]) {
          const streakData = await syncStreak();
          setStreak(streakData.current_streak);
        }
      }
    } catch (err) {
      console.error('Failed to save your progress. Please try again.', err);
      // Revert UI state on error
      setRituals(rituals);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {!isOnline && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You're offline. Changes will be saved locally and synced when you're back online.
          </AlertDescription>
        </Alert>
      )}

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
              id="breathwork"
              checked={rituals.breathwork}
              onCheckedChange={() => handleCheckboxChange('breathwork')}
            />
            <label htmlFor="breathwork" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Breathwork
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