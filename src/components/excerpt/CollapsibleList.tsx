import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from 'react-router-dom';

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
  disabled?: boolean;
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
  disabled = false
}: CollapsibleListProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showSignInDialog, setShowSignInDialog] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (disabled) {
        setShowSignInDialog(true);
      } else {
        onAdd();
      }
    }
  };

  const handleAdd = () => {
    if (disabled) {
      setShowSignInDialog(true);
    } else {
      onAdd();
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "flex items-center justify-between cursor-pointer group",
          disabled && "cursor-pointer"
        )}
        onClick={() => onOpenChange(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      {isOpen && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={inputPlaceholder}
              className="flex-1"
            />
            <Button
              onClick={handleAdd}
              disabled={!inputValue.trim()}
              className="shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-white/5 rounded-lg"
              >
                <span className="flex-1">{item}</span>
                {!disabled && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(index)}
                    className="shrink-0 hover:bg-white/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {disabled && items.length > 0 && (
            <div className="text-sm text-muted-foreground text-center py-2">
              Sign in to save your {title.toLowerCase()}
            </div>
          )}

          <Dialog open={showSignInDialog} onOpenChange={setShowSignInDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Sign in to Save Your Practice</DialogTitle>
                <DialogDescription>
                  Create an account to store your gratitudes and affirmations securely. Your practice will be saved and synced across all your devices.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <Link to="/signin" className="w-full">
                  <Button className="w-full">Sign In</Button>
                </Link>
                <Link to="/signup" className="w-full">
                  <Button variant="outline" className="w-full">Create Account</Button>
                </Link>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};
