import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import useAuthExpires from './hooks/useAuthExpires';
import ThemeProvider from './context/ThemeProvider';

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Header from './Header';
import Main from './components/Main/Main';
import Footer from './Footer';

// react app version
export const frontendVersion = process.env.REACT_APP_VERSION;

// value for new records on backend
export const newId = -1;

const App = () => {
  const { setAuthExpires } = useAuthExpires();

  // check for 'logged_in_expiration' cookie to set the initial login state
  useEffect(() => {
    const loggedInExpiration = document.cookie.match(
      new RegExp(`(^| )logged_in_expiration=([^;]+)`)
    );
    if (loggedInExpiration) {
      setAuthExpires(loggedInExpiration[2]);
    } else {
      setAuthExpires();
    }
  }, [setAuthExpires]);

  return (
    <ThemeProvider>
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
        <Router basename={process.env.PUBLIC_URL}>
          <Header />
          <Main />
        </Router>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default App;
