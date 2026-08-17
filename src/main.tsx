import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import { NovaPage } from './pages/NovaPage.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<NovaPage />} />
            <Route path="/experience" element={<NovaPage showExperience={true} />} />
            <Route path="/nova" element={<App />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
