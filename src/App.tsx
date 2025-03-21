import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import IndexPage from './pages/Index'; // Import index directly
import { clearSiteCache } from './register-sw';

// Lazy load other pages
const BreathworkPage = lazy(() => import('./pages/Breathwork'));
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
  useEffect(() => {
    // Clear site cache on mount while preserving user data
    clearSiteCache();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/breathwork" element={
              <Suspense fallback={<div className="loading-placeholder">Loading...</div>}>
                <BreathworkPage />
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
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
