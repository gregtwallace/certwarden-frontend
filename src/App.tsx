import { type FC } from 'react';

import { BrowserRouter as Router } from 'react-router';

import { AuthProvider } from './context/AuthProvider';
import { ClientSettingsProvider } from './context/ClientSettingsProvider';

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import Header from './Header';
import Main from './components/Main/Main';
import Footer from './Footer';

// no props

// component
const App: FC = () => {
  return (
    <ClientSettingsProvider>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
        }}
      >
        <Router basename={import.meta.env.BASE_URL}>
          <AuthProvider>
            <Header />
            <Main />
          </AuthProvider>
        </Router>
        <Footer />
      </Box>
    </ClientSettingsProvider>
  );
};

export default App;
