
import { LocalExcerpt } from "@/types/localExcerpt";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";

interface ImportExportProps {
  excerpts: LocalExcerpt[];
  onImport: (importedExcerpts: LocalExcerpt[]) => void;
}

export const ImportExport = ({ excerpts, onImport }: ImportExportProps) => {
  const { toast } = useToast();

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(excerpts, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', 'atmanamviddhidotin_mycollections.json');
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);

      toast({
        title: "Export successful",
        description: "Your collection has been downloaded",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "Unable to export collection",
        variant: "destructive",
      });
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const text = await file.text();
      const importedExcerpts = JSON.parse(text);

      // Update favorite status in localStorage for all imported excerpts
      const favorites = JSON.parse(localStorage.getItem('favoriteExcerpts') || '[]');
      importedExcerpts.forEach((excerpt: LocalExcerpt) => {
        if (excerpt.type === 'favorite') {
          const favoriteExcerpt = {
            text: excerpt.text,
            bookTitle: excerpt.bookTitle,
            bookAuthor: excerpt.bookAuthor,
            id: excerpt.id,
            isFavorite: true
          };
          if (!favorites.some((fav: any) => fav.id === excerpt.id)) {
            favorites.push(favoriteExcerpt);
          }
        }
      });
      localStorage.setItem('favoriteExcerpts', JSON.stringify(favorites));

      onImport(importedExcerpts);
      toast({
        title: "Import successful",
        description: "Your collection has been imported",
      });
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: "Unable to import collection",
        variant: "destructive",
      });
    }
    // Reset input
    event.target.value = '';
  };

  return (
    <div className="space-y-4">
      <div>
        <Button 
          variant="outline" 
          onClick={handleExport}
          className="w-full"
        >
          Export Collection
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="importFile">Import Collection</Label>
        <Input
          id="importFile"
          type="file"
          accept=".json"
          onChange={handleImport}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};
