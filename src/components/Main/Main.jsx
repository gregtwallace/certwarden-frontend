import { Box } from '@mui/system';

import useAuthExpires from '../../hooks/useAuthExpires';
import LoggedIn from './LoggedIn';
import Login from '../Authentication/Login';

const Main = () => {
  const { authExpires } = useAuthExpires();

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
      {!authExpires ? <Login /> : <LoggedIn />}
    </Box>
  );
};

export default Main;
