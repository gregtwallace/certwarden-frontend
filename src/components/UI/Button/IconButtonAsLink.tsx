import { type FC, type ReactNode } from 'react';
import { type LinkProps as RouterLinkProps } from 'react-router-dom';

import { Link as RouterLink } from 'react-router-dom';
import { IconButton as MuiIconButton, Tooltip } from '@mui/material';

// prop types
type propTypes = {
  children: ReactNode;

  to: RouterLinkProps['to'];
  target?: RouterLinkProps['target'];

  tooltip?: string;
};

// component
const IconButtonAsLink: FC<propTypes> = (props) => {
  const { children, target, to, tooltip } = props;

  return (
    /* Note: Tooltip doesn't show anything if title is blank */
    <Tooltip title={tooltip}>
      <MuiIconButton
        component={RouterLink}
        to={to}
        target={target}
        color='inherit'
      >
        {children}
      </MuiIconButton>
    </Tooltip>
  );
};
export default IconButtonAsLink;
