import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import IndexPage from './pages/Index';
import { clearSiteCache } from './register-sw';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

// Lazy load other pages
const WisdomPage = lazy(() => import('./pages/Wisdom'));
const BreathworkPage = lazy(() => import('./pages/Breathwork'));
const GratitudePage = lazy(() => import('./pages/Gratitude'));
const AffirmationPage = lazy(() => import('./pages/Affirmation'));
const BlogPage = lazy(() => import('./pages/Blog'));
const AboutPage = lazy(() => import('./pages/About'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));
const SignInPage = lazy(() => import('./pages/auth/SignIn'));
const SignUpPage = lazy(() => import('./pages/auth/SignUp'));
const AuthCallbackPage = lazy(() => import('./pages/auth/callback'));

// Configure Query Client with performance optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
      gcTime: 1000 * 60 * 30, // Replace cacheTime with gcTime
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Clear site cache on mount while preserving user data
    clearSiteCache();

    // Handle PWA installation prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install prompt
      setShowInstallPrompt(true);
    });

    // Handle successful installation
    window.addEventListener('appinstalled', () => {
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // Clear the deferredPrompt
    setDeferredPrompt(null);
    // Hide the install prompt
    setShowInstallPrompt(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/wisdom" element={
              <Suspense fallback={<div className="loading-placeholder">Loading...</div>}>
                <WisdomPage />
              </Suspense>
            } />
            <Route path="/breathwork" element={
              <Suspense fallback={<div className="loading-placeholder">Loading...</div>}>
                <BreathworkPage />
              </Suspense>
            } />
            <Route path="/gratitude" element={
              <Suspense fallback={<div className="loading-placeholder">Loading...</div>}>
                <GratitudePage />
              </Suspense>
            } />
            <Route path="/affirmation" element={
              <Suspense fallback={<div className="loading-placeholder">Loading...</div>}>
                <AffirmationPage />
              </Suspense>
            } />
            <Route path="/blog" element={
              <Suspense fallback={<div className="loading-placeholder">Loading...</div>}>
                <BlogPage />
              </Suspense>
            } />
            <Route path="/about" element={
              <Suspense fallback={<div className="loading-placeholder">Loading...</div>}>
                <AboutPage />
              </Suspense>
            } />
            <Route path="/signin" element={
              <Suspense fallback={<div className="loading-placeholder">Loading...</div>}>
                <SignInPage />
              </Suspense>
            } />
            <Route path="/signup" element={
              <Suspense fallback={<div className="loading-placeholder">Loading...</div>}>
                <SignUpPage />
              </Suspense>
            } />
            <Route path="/auth/callback" element={
              <Suspense fallback={<div className="loading-placeholder">Loading...</div>}>
                <AuthCallbackPage />
              </Suspense>
            } />
            <Route path="*" element={
              <Suspense fallback={<div className="loading-placeholder">Loading...</div>}>
                <NotFoundPage />
              </Suspense>
            } />
          </Routes>
          {showInstallPrompt && (
            <div className="fixed bottom-4 right-4 z-50">
              <Button
                onClick={handleInstallClick}
                className="bg-[#0A1929] hover:bg-[#1A4067] text-white flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Install App
              </Button>
            </div>
          )}
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
