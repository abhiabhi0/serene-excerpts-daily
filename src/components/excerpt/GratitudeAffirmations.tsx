
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const MAX_ITEMS = 5;
const MAX_CHARS = 100;

export const GratitudeAffirmations = () => {
  const [gratitudeList, setGratitudeList] = useState<string[]>([]);
  const [affirmationList, setAffirmationList] = useState<string[]>([]);
  const [openGratitude, setOpenGratitude] = useState(false);
  const [openAffirmation, setOpenAffirmation] = useState(false);
  const [newGratitude, setNewGratitude] = useState("");
  const [newAffirmation, setNewAffirmation] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const savedGratitude = localStorage.getItem("userGratitude");
    const savedAffirmation = localStorage.getItem("userAffirmation");
    if (savedGratitude) setGratitudeList(JSON.parse(savedGratitude));
    if (savedAffirmation) setAffirmationList(JSON.parse(savedAffirmation));
  }, []);

  const handleAddGratitude = () => {
    if (gratitudeList.length >= MAX_ITEMS) {
      toast({
        description: "You can only add up to 5 gratitudes",
        variant: "destructive",
      });
      return;
    }
    if (newGratitude.trim()) {
      const updatedList = [...gratitudeList, newGratitude];
      setGratitudeList(updatedList);
      localStorage.setItem("userGratitude", JSON.stringify(updatedList));
      setNewGratitude("");
      toast({
        description: "Gratitude added successfully",
      });
    }
  };

  const handleAddAffirmation = () => {
    if (affirmationList.length >= MAX_ITEMS) {
      toast({
        description: "You can only add up to 5 affirmations",
        variant: "destructive",
      });
      return;
    }
    if (newAffirmation.trim()) {
      const updatedList = [...affirmationList, newAffirmation];
      setAffirmationList(updatedList);
      localStorage.setItem("userAffirmation", JSON.stringify(updatedList));
      setNewAffirmation("");
      toast({
        description: "Affirmation added successfully",
      });
    }
  };

  const handleRemoveGratitude = (index: number) => {
    const updatedList = gratitudeList.filter((_, i) => i !== index);
    setGratitudeList(updatedList);
    localStorage.setItem("userGratitude", JSON.stringify(updatedList));
    toast({
      description: "Gratitude removed successfully",
    });
  };

  const handleRemoveAffirmation = (index: number) => {
    const updatedList = affirmationList.filter((_, i) => i !== index);
    setAffirmationList(updatedList);
    localStorage.setItem("userAffirmation", JSON.stringify(updatedList));
    toast({
      description: "Affirmation removed successfully",
    });
  };

  const handleGratitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setNewGratitude(value);
    } else {
      toast({
        description: `Maximum ${MAX_CHARS} characters allowed`,
        variant: "destructive",
      });
    }
  };

  const handleAffirmationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setNewAffirmation(value);
    } else {
      toast({
        description: `Maximum ${MAX_CHARS} characters allowed`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 my-8">
      <Card className="w-full bg-[#F2FCE2]/20 border-[#1A4067]/30 backdrop-blur-sm">
        <CardContent className="pt-6">
          <Collapsible open={openGratitude} onOpenChange={setOpenGratitude}>
            <CollapsibleTrigger className="flex w-full items-center justify-between">
              <Label className="text-lg font-semibold cursor-pointer">
                🙏 Appreciate Life: Write Your Gratitudes
              </Label>
              <ChevronDown className={`h-5 w-5 transition-transform ${openGratitude ? "" : "-rotate-90"}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="I am grateful for..."
                  value={newGratitude}
                  onChange={handleGratitudeChange}
                  maxLength={MAX_CHARS}
                  className="bg-white/10 border-[#1A4067]/30"
                />
                <Button 
                  onClick={handleAddGratitude}
                  className="shrink-0"
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <ul className="space-y-2">
                {gratitudeList.map((item, index) => (
                  <li key={index} className="flex items-center justify-between p-2 rounded bg-white/5">
                    <span>{item}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveGratitude(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      <Card className="w-full bg-[#E5DEFF]/20 border-[#1A4067]/30 backdrop-blur-sm">
        <CardContent className="pt-6">
          <Collapsible open={openAffirmation} onOpenChange={setOpenAffirmation}>
            <CollapsibleTrigger className="flex w-full items-center justify-between">
              <Label className="text-lg font-semibold cursor-pointer">
                ✨ Realize Your Divine Nature: Sacred Affirmations
              </Label>
              <ChevronDown className={`h-5 w-5 transition-transform ${openAffirmation ? "" : "-rotate-90"}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="I am..."
                  value={newAffirmation}
                  onChange={handleAffirmationChange}
                  maxLength={MAX_CHARS}
                  className="bg-white/10 border-[#1A4067]/30"
                />
                <Button 
                  onClick={handleAddAffirmation}
                  className="shrink-0"
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <ul className="space-y-2">
                {affirmationList.map((item, index) => (
                  <li key={index} className="flex items-center justify-between p-2 rounded bg-white/5">
                    <span>{item}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAffirmation(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  );
};
