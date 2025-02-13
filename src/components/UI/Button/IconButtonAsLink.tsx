import { type FC, type ReactNode } from 'react';
import { type LinkProps as RouterLinkProps } from 'react-router';
import { type IconButtonProps } from '@mui/material';

import { Link as RouterLink } from 'react-router';
import { IconButton as MuiIconButton, Tooltip } from '@mui/material';

// prop types
type propTypes = {
  children: ReactNode;

  to: RouterLinkProps['to'];
  target?: RouterLinkProps['target'];

  color?: IconButtonProps['color'];
  tooltip?: ReactNode;
};

// component
const IconButtonAsLink: FC<propTypes> = (props) => {
  const { children, color, target, to, tooltip } = props;

  return (
    /* Note: Tooltip doesn't show anything if title is blank */
    <Tooltip title={tooltip} placement='right'>
      <MuiIconButton
        component={RouterLink}
        to={to}
        target={target}
        color={color ?? 'inherit'}
      >
        {children}
      </MuiIconButton>
    </Tooltip>
  );
};
export default IconButtonAsLink;
