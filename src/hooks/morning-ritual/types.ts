
export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export const DEFAULT_ITEMS: ChecklistItem[] = [
  { id: 'wisdom', label: 'Wisdom', checked: false },
  { id: 'gratitude', label: 'Gratitude', checked: false },
  { id: 'affirmation', label: 'Affirmation', checked: false },
];
