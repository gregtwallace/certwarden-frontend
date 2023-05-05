import { useEffect, useState } from 'react';
import { Box } from '@mui/system';

import useAuthExpires from '../../hooks/useAuthExpires';
import LoggedIn from './LoggedIn';
import Login from '../Authentication/Login';

const Main = () => {
  const { authExpires, setAuthExpires } = useAuthExpires();
  const [renderMain, setRenderMain] = useState(false);

  // check for 'logged_in_expiration' cookie to set the initial login state
  useEffect(() => {
    const loggedInExpiration = sessionStorage.getItem('auth_expires');
    if (loggedInExpiration) {
      setAuthExpires(loggedInExpiration);
    } else {
      setAuthExpires();
    }
    setRenderMain(true);
  }, [setAuthExpires]);

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
      {renderMain && (authExpires == null ? <Login /> : <LoggedIn />)}
    </Box>
  );
};

export default Main;
