import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

// eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
