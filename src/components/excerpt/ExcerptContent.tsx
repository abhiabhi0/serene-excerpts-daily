
import { ExcerptWithMeta } from "@/types/excerpt";
import { Heart } from "lucide-react";

interface ExcerptContentProps {
  excerpt: ExcerptWithMeta;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const ExcerptContent = ({ excerpt, isFavorite, onToggleFavorite }: ExcerptContentProps) => {
  const renderText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="pt-6 px-4">
      <style>
        {`
          @keyframes heartbeat {
            0% { transform: scale(1); }
            25% { transform: scale(1.1); }
            50% { transform: scale(1); }
            75% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          .heart-beat {
            animation: heartbeat 1s ease-in-out;
          }
        `}
      </style>
      <blockquote className="text-lg mb-4 leading-relaxed text-left">
        "{renderText(excerpt.text)}"
      </blockquote>
      <div className="text-sm text-muted-foreground space-y-1 text-left">
        {excerpt.bookTitle ? (
          <p className="font-semibold">{excerpt.bookTitle}</p>
        ) : excerpt.bookAuthor ? (
          <p className="font-semibold">~ {excerpt.bookAuthor}</p>
        ) : null}
      </div>
      <div className="mt-6 pt-4 border-t border-[#1A4067]/30 text-sm text-center text-muted-foreground">
        <div className="flex items-center justify-center gap-4">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className={`p-2 rounded-full hover:bg-white/10 transition-colors ${
              isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart 
              className={`w-6 h-6 ${isFavorite ? 'fill-current heart-beat' : ''}`} 
            />
          </button>
          <div className="flex flex-col items-center">
            <img 
              src="/lovable-uploads/ic_launcher_round.png" 
              alt="Atmanam Viddhi Logo" 
              className="w-8 h-8 mx-auto mb-2"
            />
            <p className="font-semibold">Atmanam Viddhi - Know Thyself</p>
            <p className="mt-1">atmanamviddhi.in</p>
          </div>
        </div>
      </div>
    </div>
  );
};
