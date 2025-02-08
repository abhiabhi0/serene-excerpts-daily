
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ListInputProps {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
  placeholder: string;
}

export const ListInput = ({ value, onChange, onAdd, placeholder }: ListInputProps) => (
  <div className="flex gap-2">
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={100}
      className="bg-white/10 border-[#1A4067]/30"
    />
    <Button 
      onClick={onAdd}
      className="shrink-0"
      variant="outline"
    >
      <Plus className="h-4 w-4" />
    </Button>
  </div>
);

