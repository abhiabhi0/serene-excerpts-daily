
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { ListInput } from "./ListInput";
import { ListItem } from "./ListItem";

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
}: CollapsibleListProps) => (
  <Collapsible open={isOpen} onOpenChange={onOpenChange}>
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

