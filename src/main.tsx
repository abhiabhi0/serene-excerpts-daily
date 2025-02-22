
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure DOM is ready
const prepare = () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error('Failed to find the root element');
  return rootElement;
};

// Create root with error boundary
const root = createRoot(prepare());

// Defer rendering to next frame for better FCP
requestAnimationFrame(() => {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
