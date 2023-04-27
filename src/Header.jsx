import { useNavigate } from 'react-router-dom';

import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

import useAuthExpires from './hooks/useAuthExpires';

const Header = () => {
  const { authExpires } = useAuthExpires();
  const navigate = useNavigate();

  // logout handler just redirects to logout route
  const logoutHandler = () => {
    navigate('/logout');
  };

  return (
    <AppBar
      sx={{ position: 'relative', zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
        {authExpires && (
          <IconButton color='inherit' onClick={logoutHandler}>
            <LogoutIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
