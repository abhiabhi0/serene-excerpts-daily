import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ExcerptTextProps {
  text: string;
  onFormDataChange: (field: string, value: string) => void;
}

export const ExcerptText = ({ text, onFormDataChange }: ExcerptTextProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="text">Excerpt *</Label>
      <Textarea
        id="text"
        value={text}
        onChange={(e) => onFormDataChange('text', e.target.value)}
        placeholder="Enter your excerpt"
        className="min-h-[150px]"
      />
    </div>
  );
};