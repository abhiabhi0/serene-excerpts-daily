
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";

interface ExcerptTextProps {
  text: string;
  onFormDataChange: (field: string, value: string) => void;
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
}

export const ExcerptText = ({ text, onFormDataChange, textareaRef }: ExcerptTextProps) => {
  useEffect(() => {
    const handleFocus = () => {
      if (textareaRef?.current) {
        // Small delay to ensure keyboard is fully shown
        setTimeout(() => {
          textareaRef.current?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
          });
        }, 300);
      }
    };

    const textarea = textareaRef?.current;
    textarea?.addEventListener('focus', handleFocus);
    return () => textarea?.removeEventListener('focus', handleFocus);
  }, [textareaRef]);

  return (
    <div className="space-y-2">
      <Label htmlFor="text" className="text-white">Excerpt *</Label>
      <Textarea
        id="text"
        ref={textareaRef}
        value={text}
        onChange={(e) => onFormDataChange('text', e.target.value)}
        placeholder="Enter your excerpt"
        className="min-h-[150px] bg-[#0F1A2A] border-[#1E2A3B] text-white placeholder:text-white/50 focus:ring-[#3B82F6] focus:border-[#3B82F6] resize-y"
      />
    </div>
  );
};
