import { useContext } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';

import { ThemeModeContext } from '../../../context/ThemeProvider';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import BadgeIcon from '@mui/icons-material/Badge';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import DashboardIcon from '@mui/icons-material/Dashboard';
import KeyIcon from '@mui/icons-material/Key';
import SettingsIcon from '@mui/icons-material/Settings';
import StorageIcon from '@mui/icons-material/Storage';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import WidgetsIcon from '@mui/icons-material/Widgets';

import Box from '@mui/material/Box';
import { Divider } from '@mui/material';
import List from '@mui/material/List';
import NavLink from './NavLink';
import NewVersionLink from './NewVersionLink';

// Navbar is the full Navbar
const Navbar = () => {
  const theme = useTheme();
  const toggleDarkMode = useContext(ThemeModeContext);
  const bigView = useMediaQuery(theme.breakpoints.up('md'));

  // auto width for full size, else fixed
  let width = 210;
  if (!bigView) {
    width = 56;
  }

  const sxList = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    overflowX: 'hidden',
    overflowY: 'auto',
    width: width,
    minWidth: width,
    maxWidth: width,
    borderRight: 1,
    borderColor: 'grey.500',
    bgcolor: 'background.default',
  };

  return (
    <List component='nav' sx={sxList}>
      <Box>
        <NavLink to='/' iconComponent={DashboardIcon}>
          Dashboard
        </NavLink>

        <NavLink to='/privatekeys' iconComponent={KeyIcon}>
          Private Keys
        </NavLink>

        <NavLink to='/acmeaccounts' iconComponent={BadgeIcon}>
          ACME Accounts
        </NavLink>

        <NavLink to='/certificates' iconComponent={CardMembershipIcon}>
          Certificates
        </NavLink>

        <Divider sx={{ my: 1 }} />

        <NavLink to='/logs' iconComponent={TextSnippetIcon}>
          Logs
        </NavLink>

        <NavLink to='/providers' iconComponent={WidgetsIcon}>
          Providers
        </NavLink>

        <NavLink to='/acmeservers' iconComponent={StorageIcon}>
          ACME Servers
        </NavLink>

        <NavLink to='/settings' iconComponent={SettingsIcon}>
          Settings
        </NavLink>
      </Box>

      <Box
        sx={{
          minHeight: 0,
          flexGrow: 1,
        }}
      ></Box>

      <Box>
        <NewVersionLink />

        <NavLink
          onClick={toggleDarkMode}
          iconComponent={
            theme.palette.mode === 'dark' ? Brightness7Icon : Brightness4Icon
          }
        >
          {theme.palette.mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
        </NavLink>
      </Box>
    </List>
  );
};

export default Navbar;
