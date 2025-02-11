import { type FC, type ReactNode } from 'react';
import { type LinkProps as RouterLinkProps } from 'react-router';
import { type ButtonProps as MuiButtonProps } from '@mui/material';
import { type SystemStyleObject } from '@mui/system';

import { Link as RouterLink } from 'react-router';
import { Button as MuiButton } from '@mui/material';

// prop types
type propTypes = {
  children: ReactNode;

  to: RouterLinkProps['to'];
  target?: RouterLinkProps['target'];

  color?: MuiButtonProps['color'];
  disabled?: MuiButtonProps['disabled'];
  size?: MuiButtonProps['size'];
  sx?: SystemStyleObject;
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
      color={color ?? 'primary'}
      size={size ?? 'medium'}
      sx={{
        ml: 2,
        ...sx,
      }}
    >
      {children}
    </MuiButton>
  );
};

export default ButtonAsLink;
