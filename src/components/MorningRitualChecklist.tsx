
import { useState, useEffect } from 'react';
import { useMorningRitual } from '@/hooks/morning-ritual';
import { ChecklistItem } from '@/components/ritual/ChecklistItem';
import { useAnalyticsTracker } from '@/components/excerpt/AnalyticsTracker';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/AuthModal';

export const MorningRitualChecklist = () => {
  const { items, toggleItem, streak, isLoading } = useMorningRitual();
  const { trackEvent } = useAnalyticsTracker();
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Check if checklist should be shown based on user preference
  useEffect(() => {
    const hideChecklist = localStorage.getItem('hideRitualChecklist') === 'true';
    setIsVisible(!hideChecklist);
  }, []);

  const handleToggleItem = (id: string) => {
    toggleItem(id);
    
    trackEvent({
      eventName: 'morning_ritual_toggle',
      params: {
        item_id: id,
        action: 'toggle'
      }
    });
  };

  if (!isVisible) return null;

  return (
    <div className="space-y-4">
      <div className="bg-[#0A1929] rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-normal text-white/90">Today's Morning Ritual</h2>
          <button 
            onClick={() => {
              localStorage.setItem('hideRitualChecklist', 'true');
              setIsVisible(false);
            }}
            className="text-white/50 hover:text-white/80 text-xs"
          >
            Hide
          </button>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {items.map(item => (
            <ChecklistItem
              key={item.id}
              id={item.id}
              label={item.label}
              checked={item.checked}
              onToggle={handleToggleItem}
            />
          ))}
        </div>
        {user && (
          <div className="mt-3 text-xs text-white/50">
            Current streak: {isLoading ? '...' : streak} days
          </div>
        )}
      </div>

      {!user && (
        <Button 
          variant="outline" 
          className="w-full bg-[#132F4C] text-sm font-normal text-white/90 border-[#1E4976] hover:bg-[#132F4C]/80"
          onClick={() => setIsAuthModalOpen(true)}
        >
          Sign in to track your streak
        </Button>
      )}

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};
