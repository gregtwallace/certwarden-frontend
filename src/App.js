import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Box from '@mui/material/Box';

import useAuth from './hooks/useAuth';

import Header from './components/App/Header';
import Main from './components/App/Main';
import Footer from './components/App/Footer';

// react app version
export const frontendVersion = '0.5.0';

// value for new records on backend
export const newId = -1;

const App = () => {
  const { setAuth } = useAuth();

  // check for 'logged_in_expiration' cookie to set the initial login state
  useEffect(() => {
    const loggedInExpiration = document.cookie.match(
      new RegExp(`(^| )logged_in_expiration=([^;]+)`)
    );
    if (loggedInExpiration) {
      setAuth({
        loggedInExpiration: loggedInExpiration[2],
      });
    } else {
      setAuth({});
    }
  }, [setAuth]);

  return (
    <Box
      sx={{
        margin: 0,
        height: '100vh',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
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
