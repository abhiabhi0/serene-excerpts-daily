import React from 'react';
import { Instagram, Facebook } from 'lucide-react';

const SocialMediaLinks = () => {
  return (
    <div className="flex justify-center gap-4">
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
      <a 
        href="https://t.me/atmanam_viddhi" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-500"
      >
        <svg 
          viewBox="0 0 24 24" 
          className="w-6 h-6 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/>
        </svg>
      </a>
    </div>
  );
};

export default SocialMediaLinks;
