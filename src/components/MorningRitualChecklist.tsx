
import { useState } from 'react';
import { useMorningRitual } from '@/hooks/useMorningRitual';
import { ChecklistItem } from '@/components/ritual/ChecklistItem';
import { useAnalyticsTracker } from '@/components/excerpt/AnalyticsTracker';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/AuthModal';
import { Shield } from 'lucide-react';

export const MorningRitualChecklist = () => {
  const { items, toggleItem, streak, isLoading } = useMorningRitual();
  const { trackEvent } = useAnalyticsTracker();
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleToggleItem = (id: string) => {
    toggleItem(id);
    
    // Track the event
    trackEvent({
      eventName: 'morning_ritual_toggle',
      params: {
        item_id: id,
        action: 'toggle'
      }
    });
  };

  return (
    <div className="mt-4">
      <div className="flex flex-col items-center mb-4">
        <p className="text-center text-sm text-white/70 mb-2">Today's Morning Ritual</p>
        
        {user ? (
          <div className="flex items-center gap-2 bg-blue-500/20 px-3 py-1 rounded-full text-sm">
            <Shield size={16} className="text-blue-400" />
            <span>Current Streak: {isLoading ? '...' : streak} days</span>
          </div>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs" 
            onClick={() => setIsAuthModalOpen(true)}
          >
            Sign in to track your streak
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap justify-center gap-3">
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
      
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};
