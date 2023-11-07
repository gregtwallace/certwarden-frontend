import { type FC, type ReactNode } from 'react';
import { type LinkProps as RouterLinkProps } from 'react-router-dom';
import { type ButtonProps as MuiButtonProps } from '@mui/material';

import { Link as RouterLink } from 'react-router-dom';
import { Button as MuiButton } from '@mui/material';

// prop types
type propTypes = {
  children: ReactNode;

  to: RouterLinkProps['to'];
  target?: RouterLinkProps['target'];

  color?: MuiButtonProps['color'];
  disabled?: MuiButtonProps['disabled'];
  size?: MuiButtonProps['size'];
  sx?: MuiButtonProps['sx'];
};

// component
const ButtonAsLink: FC<propTypes> = (props) => {
  const { disabled, children, color, size, sx, target, to } = props;

  return (
    <MuiButton
      component={RouterLink}
      to={to}
      target={target}
      disabled={!!disabled}
      variant='contained'
      color={color ? color : 'primary'}
      size={size ? size : 'medium'}
      sx={{
        ...sx,
        ml: 2,
      }}
    >
      {children}
    </MuiButton>
  );
};

export default ButtonAsLink;
