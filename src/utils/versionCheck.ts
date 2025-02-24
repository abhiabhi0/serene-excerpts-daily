// Define the current version - update this with each deployment
export const CURRENT_VERSION = '1.0.0';

export function checkAndRefreshVersion() {
  const lastVersion = localStorage.getItem('appVersion');
  
  // If version mismatch, preserve important data and reload
  if (!lastVersion || lastVersion !== CURRENT_VERSION) {
    // Save important data
    const localExcerpts = localStorage.getItem('localExcerpts');
    const gratitude = localStorage.getItem('gratitude');
    const affirmations = localStorage.getItem('affirmations');
    
    // Clear all cache
    localStorage.clear();
    
    // Restore important data
    if (localExcerpts) localStorage.setItem('localExcerpts', localExcerpts);
    if (gratitude) localStorage.setItem('gratitude', gratitude);
    if (affirmations) localStorage.setItem('affirmations', affirmations);
    
    // Set new version
    localStorage.setItem('appVersion', CURRENT_VERSION);
    
    // Force reload to get fresh assets
    window.location.reload();
  }
}
