
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export const GratitudeAffirmations = () => {
  const [gratitude, setGratitude] = useState("");
  const [affirmation, setAffirmation] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const savedGratitude = localStorage.getItem("userGratitude");
    const savedAffirmation = localStorage.getItem("userAffirmation");
    if (savedGratitude) setGratitude(savedGratitude);
    if (savedAffirmation) setAffirmation(savedAffirmation);
  }, []);

  const handleGratitudeChange = (value: string) => {
    setGratitude(value);
    localStorage.setItem("userGratitude", value);
    toast({
      description: "Gratitude saved successfully",
      duration: 1000,
    });
  };

  const handleAffirmationChange = (value: string) => {
    setAffirmation(value);
    localStorage.setItem("userAffirmation", value);
    toast({
      description: "Affirmation saved successfully",
      duration: 1000,
    });
  };

  return (
    <div className="space-y-4">
      <Card className="w-full bg-[#F2FCE2]/20 border-[#1A4067]/30 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label htmlFor="gratitude" className="text-lg font-semibold">
              🙏 Appreciate Life: Write Your Gratitudes
            </Label>
            <Textarea
              id="gratitude"
              placeholder="I am grateful for..."
              value={gratitude}
              onChange={(e) => handleGratitudeChange(e.target.value)}
              className="min-h-[100px] bg-white/10 border-[#1A4067]/30"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="w-full bg-[#E5DEFF]/20 border-[#1A4067]/30 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label htmlFor="affirmation" className="text-lg font-semibold">
              ✨ Realize Your Divine Nature: Sacred Affirmations
            </Label>
            <Textarea
              id="affirmation"
              placeholder="I am..."
              value={affirmation}
              onChange={(e) => handleAffirmationChange(e.target.value)}
              className="min-h-[100px] bg-white/10 border-[#1A4067]/30"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
