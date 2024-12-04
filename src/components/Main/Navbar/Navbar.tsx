import { type FC } from 'react';

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

// no props

// Navbar is the full Navbar
const Navbar: FC = () => {
  const theme = useTheme();
  const wideSize = useMediaQuery(theme.breakpoints.up('md'));

  // full size vs. small width
  let width = 200;
  if (!wideSize) {
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

        <NavLink to='/orderacmequeue' IconComponent={FormatListNumberedIcon}>
          ACME Queue
        </NavLink>

        <NavLink to='/orderpostqueue' IconComponent={FormatListNumberedIcon}>
          Post Queue
        </NavLink>

        <NavLink to='/logs' IconComponent={TextSnippetIcon}>
          Logs
        </NavLink>

        <Divider sx={{ my: 1 }} />

        <NavLink to='/challenges/providers' IconComponent={WidgetsIcon}>
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
        <NewVersionLink showSecondaryAction={wideSize} />
      </Box>
    </List>
  );
};

export default Navbar;
