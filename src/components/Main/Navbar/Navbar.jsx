import { useMediaQuery, useTheme } from '@mui/material';

import BadgeIcon from '@mui/icons-material/Badge';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
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
  const bigView = useMediaQuery(theme.breakpoints.up('md'));

  // auto width for full size, else fixed
  let width = 200;
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
        <NavLink to='/' IconComponent={DashboardIcon}>
          Dashboard
        </NavLink>

        <NavLink to='/privatekeys' IconComponent={KeyIcon}>
          Private Keys
        </NavLink>

        <NavLink to='/acmeaccounts' IconComponent={BadgeIcon}>
          ACME Accounts
        </NavLink>

        <NavLink to='/certificates' IconComponent={CardMembershipIcon}>
          Certificates
        </NavLink>

        <Divider sx={{ my: 1 }} />

        <NavLink to='/orderqueue' IconComponent={FormatListNumberedIcon}>
          Order Queue
        </NavLink>

        <NavLink to='/logs' IconComponent={TextSnippetIcon}>
          Logs
        </NavLink>

        <Divider sx={{ my: 1 }} />

        <NavLink to='/providers' IconComponent={WidgetsIcon}>
          Providers
        </NavLink>

        <NavLink to='/acmeservers' IconComponent={StorageIcon}>
          ACME Servers
        </NavLink>

        <NavLink to='/settings' IconComponent={SettingsIcon}>
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
        <NewVersionLink bigView={bigView} />
      </Box>
    </List>
  );
};

export default Navbar;
