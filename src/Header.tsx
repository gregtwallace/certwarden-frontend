import { type FC } from 'react';

import useAuth from './hooks/useAuth';

import { AppBar, Toolbar, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

import IconButtonAsLink from './components/UI/Button/IconButtonAsLink';

// no props

// component
const Header: FC = () => {
  const { isLoggedIn } = useAuth();

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
          Cert Warden
        </Typography>

        {isLoggedIn && (
          <IconButtonAsLink tooltip='Logout' to='/logout'>
            <LogoutIcon />
          </IconButtonAsLink>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
