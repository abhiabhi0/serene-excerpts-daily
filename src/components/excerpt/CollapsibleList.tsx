
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { ListInput } from "./ListInput";
import { ListItem } from "./ListItem";

// Define gtag for TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'event', 
      action: string, 
      params: Record<string, any>
    ) => void;
  }
}

interface CollapsibleListProps {
  title: string;
  items: string[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  inputValue: string;
  onInputChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  inputPlaceholder: string;
}

export const CollapsibleList = ({
  title,
  items,
  isOpen,
  onOpenChange,
  inputValue,
  onInputChange,
  onAdd,
  onRemove,
  inputPlaceholder,
}: CollapsibleListProps) => {
  // Add tracking wrapper for collapsible toggle
  const handleOpenChangeWithAnalytics = (open: boolean) => {
    // Track collapsible toggle
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'collapsible_toggle', {
        'event_category': 'engagement',
        'event_label': title, // Track which section was toggled (e.g., "Gratitude", "Affirmation")
        'action': open ? 'expand' : 'collapse',
        'items_count': items.length
      });
    }
  
    // Call the original handler
    onOpenChange(open);
  };

  // Handle keypress on input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onAdd();
    }
  };

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={handleOpenChangeWithAnalytics}
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between">
        <Label className="text-lg font-semibold cursor-pointer">
          {title}
        </Label>
        <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "" : "-rotate-90"}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4 space-y-4">
        <ListInput
          value={inputValue}
          onChange={onInputChange}
          onAdd={onAdd}
          placeholder={inputPlaceholder}
          onKeyPress={handleKeyPress}
        />
        <ul className="space-y-2">
          {items.map((item, index) => (
            <ListItem
              key={index}
              item={item}
              onRemove={() => onRemove(index)}
            />
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
};
