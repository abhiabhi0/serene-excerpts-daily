
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ListItemProps {
  item: string;
  onRemove: () => void;
}

export const ListItem = ({ item, onRemove }: ListItemProps) => (
  <li className="flex items-center justify-between p-2 rounded bg-white/5">
    <span className="break-words overflow-hidden mr-2 flex-1">{item}</span>
    <Button
      variant="ghost"
      size="sm"
      onClick={onRemove}
      className="shrink-0"
    >
      <X className="h-4 w-4" />
    </Button>
  </li>
);

