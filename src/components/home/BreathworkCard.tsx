
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wind } from "lucide-react";

export const BreathworkCard = () => {
  return (
    <div className="mb-4 p-4 rounded-lg bg-blue-900/20 border border-blue-700/20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium mb-1">One Minute Breathwork</h3>
          <p className="text-sm text-white/70">Take a short breathing break to re-center your mind</p>
        </div>
        <Link to="/breathwork">
          <Button variant="secondary" className="w-full md:w-auto flex items-center gap-2">
            <Wind size={16} /> Start Breathing
          </Button>
        </Link>
      </div>
    </div>
  );
};
