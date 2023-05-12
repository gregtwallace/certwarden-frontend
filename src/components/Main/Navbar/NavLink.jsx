import { Link, matchPath, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// NavLink is a single link in the Navbar. If it receives a 'to' prop
// it renders as a Link, otherwise it renders as ListItemButton
const NavLink = (props) => {
  // selected logic (is current route the 'to' route)
  const { pathname } = useLocation();
  var selected = false;
  // only possible to be selected if route 'to' is specified
  // will error if try to match unspecified 'to'
  if (props.to != null && !props.neverSelect) {
    selected = matchPath(pathname, props.to) != null;
  }

  return (
    <ListItemButton
      selected={selected}
      component={props.to && Link}
      to={props.to}
      onClick={props.onClick}
      sx={props.sx}
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
  neverSelect: PropTypes.bool,
  sx: PropTypes.object,
};

export default NavLink;
