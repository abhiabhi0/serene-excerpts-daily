import { ExcerptWithMeta } from "@/types/excerpt";

interface ExcerptContentProps {
  excerpt: ExcerptWithMeta;
}

export const ExcerptContent = ({ excerpt }: ExcerptContentProps) => {
  return (
    <div className="pt-6 px-4">
      <blockquote className="text-lg mb-4 leading-relaxed text-left">
        "{excerpt.text}"
      </blockquote>
      <div className="text-sm text-muted-foreground space-y-1 text-left">
        {excerpt.bookTitle && <p className="font-semibold">{excerpt.bookTitle}</p>}
        {excerpt.bookAuthor && <p>by {excerpt.bookAuthor}</p>}
        {excerpt.translator && <p>translated by {excerpt.translator}</p>}
      </div>
      <div className="mt-6 pt-4 border-t border-[#1A4067]/30 text-sm text-center text-muted-foreground">
        <img 
          src="/lovable-uploads/ic_launcher_round.png" 
          alt="Atmanam Viddhi Logo" 
          className="w-8 h-8 mx-auto mb-2"
        />
        <p className="font-semibold">Atmanam Viddhi - Know Thyself</p>
        <p className="mt-1">atmanamviddhi.github.io</p>
      </div>
    </div>
  );
};