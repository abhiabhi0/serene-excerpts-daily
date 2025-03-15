export const deferredLoad = (callback: () => void, delay = 1000) => {
  if (typeof window !== 'undefined') {
    // Check if the page has already loaded
    if (document.readyState === 'complete') {
      setTimeout(callback, delay);
    } else {
      // Otherwise, wait for the window load event
      window.addEventListener('load', () => {
        setTimeout(callback, delay);
      });
    }
  }
};
