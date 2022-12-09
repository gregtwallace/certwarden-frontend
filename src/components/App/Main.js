import { BrowserRouter as Router } from 'react-router-dom';

import { Box } from '@mui/system';
import Toolbar from '@mui/material/Toolbar';

import useAuth from '../../hooks/useAuth';
import LoggedIn from './LoggedIn';
import Login from '../Login/Login';

const Main = () => {
  const { auth } = useAuth();

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Box
        component='main'
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          width: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
        }}
      >
        <Toolbar variant='dense' />

        {/* Not Logged In vs. Logged In */}
        {!auth.loggedInExpiration ? <Login /> : <LoggedIn />}
      </Box>
    </Router>
  );
};

export default Main;
