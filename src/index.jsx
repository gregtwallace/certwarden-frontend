import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { AuthExpiresProvider } from './context/AuthExpiresProvider';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AuthExpiresProvider>
      <App />
    </AuthExpiresProvider>
  </React.StrictMode>
);
