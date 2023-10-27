import { Link } from 'react-router-dom';
import useAuth from './hooks/useAuth';

import {
  AppBar,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const Header = () => {
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
          LeGo CertHub
        </Typography>

        {isLoggedIn && (
          <Tooltip title='Logout'>
            <IconButton LinkComponent={Link} color='inherit' to='/logout'>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
