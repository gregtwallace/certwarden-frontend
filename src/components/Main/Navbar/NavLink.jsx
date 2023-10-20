import { Link, matchPath, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// NavLink is a single link in the Navbar. If it receives a 'to' prop
// it renders as a Link, otherwise it renders as ListItemButton
const NavLink = (props) => {
  const {
    children,
    color,
    IconComponent,
    onClick,
    secondaryAction,
    target,
    to,
  } = props;

  // selected logic (is current route the 'to' route)
  const { pathname } = useLocation();
  const selected = matchPath(pathname, to) != null;

  return (
    <ListItem disablePadding secondaryAction={secondaryAction}>
      <ListItemButton
        selected={selected}
        component={to && Link}
        to={to}
        target={target}
        onClick={onClick}
      >
        <ListItemIcon style={{ minWidth: '40px' }}>
          <IconComponent color={color} />
        </ListItemIcon>

        <ListItemText
          primary={children}
          primaryTypographyProps={{
            style: {
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
          }}
        />
      </ListItemButton>
    </ListItem>
  );
};

NavLink.propTypes = {
  children: PropTypes.any.isRequired,
  IconComponent: PropTypes.elementType.isRequired,
  to: PropTypes.string,
  target: PropTypes.string,
  onClick: PropTypes.func,
  color: PropTypes.string,
  secondaryAction: PropTypes.element,
};

export default NavLink;
