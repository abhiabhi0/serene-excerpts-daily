
import { lazy, Suspense, useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

// Lazy load pages
const Index = lazy(() => import('./pages/Index'));
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
const NotFound = lazy(() => import('./pages/NotFound'));

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-pulse text-xl text-primary">Loading...</div>
        </div>
      }>
        <Index />
      </Suspense>
    ),
  },
  {
    path: '/about',
    element: (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-pulse text-xl text-primary">Loading...</div>
        </div>
      }>
        <About />
      </Suspense>
    ),
  },
  {
    path: '/blog',
    element: (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-pulse text-xl text-primary">Loading...</div>
        </div>
      }>
        <Blog />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-pulse text-xl text-primary">Loading...</div>
        </div>
      }>
        <NotFound />
      </Suspense>
    ),
  },
]);

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

  function App() {;
    return (
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    );
  }
export default App;
