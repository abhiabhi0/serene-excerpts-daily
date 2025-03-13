
import { CheckSquare, Square } from 'lucide-react';

interface ChecklistItemProps {
  id: string;
  label: string;
  checked: boolean;
  onToggle: (id: string) => void;
}

export const ChecklistItem = ({ id, label, checked, onToggle }: ChecklistItemProps) => {
  return (
    <div 
      onClick={() => onToggle(id)}
      className="flex items-center gap-1 bg-white/10 px-3 py-2 rounded-md cursor-pointer hover:bg-white/15 transition-colors"
    >
      {checked ? (
        <CheckSquare className="w-4 h-4 text-green-400" />
      ) : (
        <Square className="w-4 h-4" />
      )}
      <span className="text-sm">{label}</span>
    </div>
  );
};
