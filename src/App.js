import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Box from '@mui/material/Box';

import useAuthExpires from './hooks/useAuthExpires';

import Header from './Header';
import Main from './components/Main/Main';
import Footer from './Footer';

// react app version
export const frontendVersion = '0.5.0';

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
  );
};

export default App;
