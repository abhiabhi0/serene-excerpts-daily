
export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface MorningRitualState {
  items: ChecklistItem[];
  lastUpdated: string | null;
}
