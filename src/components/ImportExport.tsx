import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { LocalExcerpt } from "@/types/localExcerpt";

interface ImportExportProps {
  excerpts: LocalExcerpt[];
  onImport: (importedExcerpts: LocalExcerpt[]) => void;
}

export const ImportExport = ({ excerpts, onImport }: ImportExportProps) => {
  const { toast } = useToast();

  const handleExport = () => {
    const dataStr = JSON.stringify(excerpts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-excerpts.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedExcerpts = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedExcerpts) && importedExcerpts.every(isValidExcerpt)) {
          onImport(importedExcerpts);
          toast({
            title: "Success",
            description: "Excerpts imported successfully!",
          });
        } else {
          throw new Error("Invalid format");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Invalid file format",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const isValidExcerpt = (excerpt: any): excerpt is LocalExcerpt => {
    return typeof excerpt.id === 'string' &&
           typeof excerpt.bookTitle === 'string' &&
           typeof excerpt.category === 'string' &&
           typeof excerpt.language === 'string' &&
           typeof excerpt.text === 'string' &&
           typeof excerpt.createdAt === 'string';
  };

  return (
    <Card className="w-full bg-[#0A1929] border-[#1A4067]/30 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Button 
            onClick={handleExport}
            className="flex-1"
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Excerpts
          </Button>
          <div className="flex-1">
            <Input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              id="import-file"
            />
            <Button 
              onClick={() => document.getElementById('import-file')?.click()}
              className="w-full"
              variant="outline"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Excerpts
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};