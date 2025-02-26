
import React from 'react';
import { useToast } from "@/components/ui/use-toast";
import SocialMediaLinks from '../SocialMediaLinks'; // Adjust the path as necessary
import { IndianRupee } from "lucide-react"; // Ensure this import is included

export const SupportSection = () => {
  const { toast } = useToast();
  
  const handleCopyUPI = async () => {
    try {
      await navigator.clipboard.writeText("atmanamviddhi@axl");
      toast({
        title: "UPI ID Copied",
        description: "The UPI ID has been copied to your clipboard",
      });
    } catch (err) {
      console.error("Failed to copy UPI ID:", err);
    }
  };

  return (
    <>
      <div className="p-4 sm:p-6 text-center">
        <h2 className="text-lg font-semibold mb-4">Support Atmanam Viddhi</h2>
        <div className="flex flex-col items-center gap-4">
          <a href="https://www.buymeacoffee.com/botman1001">
            <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a book&emoji=📖&slug=botman1001&button_colour=BD5FFF&font_colour=ffffff&font_family=Comic&outline_colour=000000&coffee_colour=FFDD00" />
          </a>
          
            <h3 className="text-sm font-medium mb-2">UPI Payment (India)</h3>
            <button
              onClick={handleCopyUPI}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-[#1A4067] hover:bg-[#1A4067]/80 rounded-md transition-colors"
            >
              <IndianRupee className="w-4 h-4" />
              <span>atmanamviddhi@axl</span>
            </button>
        </div>
      </div>
      <div className="p-4 sm:p-6 pt-0 flex justify-center gap-4">
        <SocialMediaLinks />
      </div>
    </>
  );
};
