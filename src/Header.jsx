import { Link } from 'react-router-dom';

import {
  AppBar,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

import useAuthExpires from './hooks/useAuthExpires';

const Header = () => {
  const { authExpires } = useAuthExpires();

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
