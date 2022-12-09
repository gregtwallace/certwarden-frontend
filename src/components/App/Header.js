import { useNavigate } from 'react-router-dom';

import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

import useAuth from '../../hooks/useAuth';
import useAxiosSend from '../../hooks/useAxiosSend';

const Header = () => {
  const { auth, setAuth } = useAuth();
  const [, sendData] = useAxiosSend();

  const navigate = useNavigate();

  // logout handler
  // backend clears cookie on the call to /logout
  const logoutHandler = () => {
    sendData(`/v1/auth/logout`, 'POST', null, true).then((success) => {
      if (success) {
        // update auth state
        setAuth({});
        navigate('/');
      }
    });
  };

  return (
    <AppBar
      position='fixed'
      sx={{ flex: 'none', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar variant='dense'>
        <Typography
          component='h1'
          variant='h6'
          color='inherit'
          sx={{ flexGrow: 1 }}
        >
          LeGo CertHub
        </Typography>
        {auth.loggedInExpiration && (
          <IconButton color='inherit' onClick={logoutHandler}>
            <LogoutIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
