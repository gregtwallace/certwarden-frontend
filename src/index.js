import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { AuthProvider } from './context/AuthProvider';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const container = document.getElementById('root');
const root = createRoot(container);

const theme = createTheme({
  palette: {
    //mode: 'dark',
  },
});

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>

      <CssBaseline />

      <AuthProvider>
        <App />
      </AuthProvider>
      
    </ThemeProvider>
  </React.StrictMode>
);
