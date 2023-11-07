import { type FC, type ReactNode } from 'react';
import {
  type SvgIconOwnProps,
  type SvgIconTypeMap,
} from '@mui/material/SvgIcon';
import { type OverridableComponent } from '@mui/material/OverridableComponent';
import { type LinkProps as RouterLinkProps } from 'react-router-dom';

import { Link, matchPath, useLocation } from 'react-router-dom';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Tooltip } from '@mui/material';

// prop types
type propTypes = {
  children: ReactNode;

  to: RouterLinkProps['to'];
  target?: RouterLinkProps['target'];

  IconComponent: OverridableComponent<SvgIconTypeMap>;
  iconColor?: SvgIconOwnProps['color'];

  secondaryAction?: ReactNode;
};

// NavLink is a single link in the Navbar. If it receives a 'to' prop
// it renders as a Link, otherwise it renders as ListItemButton
const NavLink: FC<propTypes> = (props) => {
  const { children, iconColor, IconComponent, secondaryAction, target, to } =
    props;

  // selected logic (is current route the 'to' route)
  const { pathname } = useLocation();
  const selected = typeof to === 'string' && matchPath(pathname, to) != null;

  return (
    <Tooltip title={children} placement='right'>
      <ListItem disablePadding secondaryAction={secondaryAction}>
        <ListItemButton
          component={Link}
          selected={selected}
          to={to}
          target={target}
        >
          <ListItemIcon style={{ minWidth: '40px' }}>
            <IconComponent color={iconColor || 'inherit'} />
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
    </Tooltip>
  );
};

export default NavLink;
