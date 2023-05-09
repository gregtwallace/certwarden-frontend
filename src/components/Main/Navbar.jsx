import { useContext } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import { useMediaQuery, useTheme } from '@mui/material';
import { ThemeModeContext } from '../../context/ThemeProvider';

import Box from '@mui/material/Box';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Divider } from '@mui/material';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import BadgeIcon from '@mui/icons-material/Badge';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import KeyIcon from '@mui/icons-material/Key';
import SettingsIcon from '@mui/icons-material/Settings';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

// ListItem is a single link in the Navbar. If it receives a 'to' prop
// it renders as a Link.
const NavLink = (props) => {
  // selected logic (is current route the 'to' route)
  const { pathname } = useLocation();
  var selected = false;
  // only possible to be selected if route 'to' is specified
  // will error if try to match unspecified 'to'
  if (props.to != null) {
    selected = matchPath(pathname, props.to) != null;
  }

  return (
    <ListItemButton
      selected={selected}
      component={props.to && Link}
      to={props.to}
      onClick={props.onClick}
    >
      <ListItemIcon>
        <props.iconComponent />
      </ListItemIcon>
      <ListItemText
        primary={props.children}
        primaryTypographyProps={{
          style: {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
        }}
      />
    </ListItemButton>
  );
};

NavLink.propTypes = {
  children: PropTypes.any.isRequired,
  iconComponent: PropTypes.elementType.isRequired,
  to: PropTypes.string,
  onClick: PropTypes.func,
};

// Navbar is the full Navbar
const Navbar = () => {
  const theme = useTheme();
  const toggleDarkMode = useContext(ThemeModeContext);
  const bigView = useMediaQuery(theme.breakpoints.up('md'));

  // auto width for full size, else fixed
  let width = 'auto';
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
        <Divider sx={{ my: 1 }} />

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
