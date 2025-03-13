
import { useMorningRitual } from '@/hooks/useMorningRitual';
import { ChecklistItem } from '@/components/ritual/ChecklistItem';
import { useAnalyticsTracker } from '@/components/excerpt/AnalyticsTracker';

export const MorningRitualChecklist = () => {
  const { items, toggleItem } = useMorningRitual();
  const { trackEvent } = useAnalyticsTracker();

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
      <p className="text-center text-sm text-white/70 mb-2">Today's Morning Ritual</p>
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
    </div>
  );
};
