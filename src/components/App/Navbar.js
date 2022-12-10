import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import DashboardIcon from '@mui/icons-material/Dashboard';
import { Divider } from '@mui/material';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import BadgeIcon from '@mui/icons-material/Badge';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import KeyIcon from '@mui/icons-material/Key';
import SettingsIcon from '@mui/icons-material/Settings';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

const Navbar = () => {
  const theme = useTheme();
  const bigView = useMediaQuery(theme.breakpoints.up('md'));

  // logic for hiding list text and adding noWrap
  const ListText = (props) => {
    return (
      <>
        {bigView && (
          <ListItemText
            primary={props.primary}
            noWrap
            primaryTypographyProps={{
              style: {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
            }}
          />
        )}
      </>
    );
  };

  let width = 'auto';
  if (!bigView) {
    width = '56px';
  }

  const sxList = {
    width: width,
    borderRight: 1,
    borderColor: 'grey.500',
    bgcolor: 'background.default',
  };

  return (
    <List component='nav' sx={sxList}>
      <ListItemButton component={Link} to='/'>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListText primary='Dashboard' />
      </ListItemButton>

      <ListItemButton component={Link} to='/privatekeys'>
        <ListItemIcon>
          <KeyIcon />
        </ListItemIcon>
        <ListText primary='Private Keys' />
      </ListItemButton>

      <ListItemButton component={Link} to='/acmeaccounts'>
        <ListItemIcon>
          <BadgeIcon />
        </ListItemIcon>
        <ListText primary='ACME Accounts' />
      </ListItemButton>

      <ListItemButton component={Link} to='/certificates'>
        <ListItemIcon>
          <CardMembershipIcon />
        </ListItemIcon>
        <ListText primary='Certificates' />
      </ListItemButton>

      <Divider sx={{ my: 2 }} />

      <ListItemButton component={Link} to='/logs'>
        <ListItemIcon>
          <TextSnippetIcon />
        </ListItemIcon>
        <ListText primary='Logs' />
      </ListItemButton>

      <ListItemButton component={Link} to='/settings'>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListText primary='Settings' />
      </ListItemButton>
    </List>
  );
};

export default Navbar;
