import { Instagram, Facebook } from "lucide-react";

export const SupportSection = () => {
  return (
    <>
      <div className="p-4 sm:p-6 text-center">
        <h2 className="text-lg font-semibold mb-4">Support Atmanam Viddhi</h2>
        <div className="flex flex-col items-center gap-4">
          <a href="https://www.buymeacoffee.com/botman1001">
            <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a book&emoji=📖&slug=botman1001&button_colour=BD5FFF&font_colour=ffffff&font_family=Comic&outline_colour=000000&coffee_colour=FFDD00" />
          </a>
        </div>
      </div>
      <div className="p-4 sm:p-6 pt-0 flex justify-center gap-4">
        <a 
          href="https://instagram.com/atmanam.viddhi" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-pink-600 hover:text-pink-700"
        >
          <Instagram className="w-6 h-6" />
        </a>
        <a 
          href="https://facebook.com/atmanam.viddhi" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700"
        >
          <Facebook className="w-6 h-6" />
        </a>
      </div>
    </>
  );
};