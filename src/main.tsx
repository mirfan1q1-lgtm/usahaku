import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import { optimizeCoreWebVitals, registerServiceWorker } from './lib/performance';

// Optimize for Core Web Vitals
optimizeCoreWebVitals();

// Register service worker
registerServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);
