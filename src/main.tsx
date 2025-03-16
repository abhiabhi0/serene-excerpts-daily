
import { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { registerServiceWorker, checkForAppUpdates } from './register-sw';
import { useToast } from '@/components/ui/use-toast';

// Properly implement lazy loading with correct typing
const App = lazy(() => import('./App'));

// Ensure DOM is ready
const prepare = () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error('Failed to find the root element');
  return rootElement;
};

// Create root with error boundary
const root = createRoot(prepare());

// Simple loading state
const LoadingFallback = () => (
  <div className="min-h-screen bg-[#0A1929] flex items-center justify-center">
    <div className="animate-pulse space-y-4">
      <div className="h-40 bg-white/5 rounded-lg w-64"></div>
    </div>
  </div>
);

// Register service worker and check for updates
registerServiceWorker();

// Defer initial render
requestAnimationFrame(() => {
  root.render(
    <Suspense fallback={<LoadingFallback />}>
      <App />
    </Suspense>
  );
  
  // Check for app updates
  checkForAppUpdates(() => {
    const { toast } = useToast();
    toast({
      title: "Update Available",
      description: "A new version is available. Please refresh to update.",
      action: <button 
        onClick={() => window.location.reload()} 
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Refresh
      </button>
    });
  });
});
