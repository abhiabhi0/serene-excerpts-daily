import { LocalExcerpt } from '../types/localExcerpt';

export function migrateLocalExcerpts(): void {
  const localExcerpts = JSON.parse(localStorage.getItem('localExcerpts') || '[]');
  
  // Check if any excerpt needs migration
  const needsMigration = localExcerpts.some((excerpt: LocalExcerpt) => !('type' in excerpt));
  
  if (needsMigration) {
    const migratedExcerpts = localExcerpts.map((excerpt: LocalExcerpt) => ({
      ...excerpt,
      type: 'user-created' // Set default type for existing entries
    }));
    
    localStorage.setItem('localExcerpts', JSON.stringify(migratedExcerpts));
  }
}

export function getLocalExcerpts(): LocalExcerpt[] {
  const excerpts = JSON.parse(localStorage.getItem('localExcerpts') || '[]');
  return excerpts.map((excerpt: LocalExcerpt) => ({
    ...excerpt,
    type: excerpt.type || 'user-created'
  }));
}
