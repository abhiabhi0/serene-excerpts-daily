  import React, { Suspense, lazy } from 'react';
  import { BrowserRouter, Routes, Route } from 'react-router-dom';
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
  import { Toaster } from '@/components/ui/toaster';
  import IndexPage from './pages/Index'; // Import index directly

  // Lazy load other pages
  const BreathworkPage = lazy(() => import('./pages/Breathwork'));
  const BlogPage = lazy(() => import('./pages/Blog'));
  const AboutPage = lazy(() => import('./pages/About'));
  const NotFoundPage = lazy(() => import('./pages/NotFound'));

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
    return (
      <QueryClientProvider client={queryClient}>
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
            <Route path="*" element={
              <Suspense fallback={<div className="loading-placeholder">Loading...</div>}>
                <NotFoundPage />
              </Suspense>
            } />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </QueryClientProvider>
    );
  }

  export default App;
