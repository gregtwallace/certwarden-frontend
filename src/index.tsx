import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthProvider.tsx';

import App from './App.tsx';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
