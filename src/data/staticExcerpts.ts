
import type { FlattenedExcerpt } from "../types/excerpt";

// Initialize with empty defaults
export const staticExcerpts: FlattenedExcerpt[] = [];
export const staticLanguages: string[] = [];
export const staticBooks: any[] = [];

// Load data asynchronously
const loadData = async () => {
  try {
    const response = await fetch('/data/generatedExcerpts.json');
    const data = await response.json();
    
    // Update the exported values
    Object.assign(staticExcerpts, data.excerpts || []);
    Object.assign(staticLanguages, data.languages || []);
    Object.assign(staticBooks, data.books || []);
  } catch (error) {
    console.error('Failed to load excerpts data:', error);
  }
};

// Load data immediately
loadData();
