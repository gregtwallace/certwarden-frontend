import { useEffect, useState } from 'react';
import { Box } from '@mui/system';

import useAuthExpires from '../../hooks/useAuthExpires';
import LoggedIn from './LoggedIn';
import Login from './Login/Login';

const Main = () => {
  const { authExpires, setAuthExpires } = useAuthExpires();
  const [renderMain, setRenderMain] = useState(false);

  // check for 'auth_expires' session item to set the initial login state
  useEffect(() => {
    const loggedInExpiration = sessionStorage.getItem('auth_expires');
    if (loggedInExpiration) {
      setAuthExpires(loggedInExpiration);
    } else {
      setAuthExpires();
    }
    setRenderMain(true);
  }, [setAuthExpires, setRenderMain]);

  return (
    <Box
      component='main'
      sx={{
        minHeight: 0,
        flexGrow: 1,
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
