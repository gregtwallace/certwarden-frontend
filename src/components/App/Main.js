import { Box } from '@mui/system';

import useAuth from '../../hooks/useAuth';
import LoggedIn from './LoggedIn';
import Login from '../Authentication/Login';

const Main = () => {
  const { auth } = useAuth();

  return (
    <Box
      component='main'
      sx={{
        minHeight: 0,
        flexGrow: 1,
        overflowY: 'auto',

        display: 'flex',
        flexDirection: 'row',
      }}
    >
      {/* Not Logged In vs. Logged In */}
      {!auth.loggedInExpiration ? <Login /> : <LoggedIn />}
    </Box>
  );
};

export default Main;
