import { Box } from '@mui/system';
import Toolbar from '@mui/material/Toolbar';

import useAuth from '../../hooks/useAuth';
import LoggedIn from './LoggedIn';
import Login from '../Authentication/Login';

const Main = () => {
  const { auth } = useAuth();

  return (
    <Box component='main'>
      <Toolbar variant='dense' />

      {/* Not Logged In vs. Logged In */}
      {!auth.loggedInExpiration ? <Login /> : <LoggedIn />}
    </Box>
  );
};

export default Main;
