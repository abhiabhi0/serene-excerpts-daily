
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ExcerptTextProps {
  text: string;
  onFormDataChange: (field: string, value: string) => void;
}

export const ExcerptText = ({ text, onFormDataChange }: ExcerptTextProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="text" className="text-white">Excerpt *</Label>
      <Textarea
        id="text"
        value={text}
        onChange={(e) => onFormDataChange('text', e.target.value)}
        placeholder="Enter your excerpt"
        className="min-h-[150px] bg-[#0F1A2A] border-[#1E2A3B] text-white placeholder:text-white/50 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
      />
    </div>
  );
};
