import { Checkbox } from "@/components/ui/checkbox";

interface ChecklistItemProps {
  id: string;
  label: string;
  checked: boolean;
  onToggle: (id: string) => void;
}

export const ChecklistItem = ({ id, label, checked, onToggle }: ChecklistItemProps) => {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={() => onToggle(id)}
        className="h-[18px] w-[18px] rounded-[2px] bg-[#132F4C] border-[#1E4976]"
      />
      <label
        htmlFor={id}
        className="text-[13px] font-normal text-white/70"
      >
        {label}
      </label>
    </div>
  );
};
