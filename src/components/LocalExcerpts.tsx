import { useState } from "react";
import { LocalExcerpt } from "@/types/localExcerpt";
import { ExcerptForm } from "./ExcerptForm";
import { ExcerptList } from "./ExcerptList";
import { ImportExport } from "./ImportExport";

export const LocalExcerpts = () => {
  const [excerpts, setExcerpts] = useState<LocalExcerpt[]>(() => {
    const saved = localStorage.getItem("localExcerpts");
    return saved ? JSON.parse(saved) : [];
  });

  const handleAddExcerpt = (newExcerpt: LocalExcerpt) => {
    const updatedExcerpts = [newExcerpt, ...excerpts];
    setExcerpts(updatedExcerpts);
    localStorage.setItem("localExcerpts", JSON.stringify(updatedExcerpts));
  };

  const handleImport = (importedExcerpts: LocalExcerpt[]) => {
    const updatedExcerpts = [...importedExcerpts, ...excerpts];
    setExcerpts(updatedExcerpts);
    localStorage.setItem("localExcerpts", JSON.stringify(updatedExcerpts));
  };

  const getUniqueBooks = () => {
    const books = new Set(excerpts.map(e => e.bookTitle));
    return Array.from(books);
  };

  return (
    <div className="w-[98%] mx-auto min-h-screen space-y-4 px-1">
      <ExcerptList excerpts={excerpts} />
      <ExcerptForm onSubmit={handleAddExcerpt} existingBooks={getUniqueBooks()} />
      <ImportExport excerpts={excerpts} onImport={handleImport} />
    </div>
  );
};