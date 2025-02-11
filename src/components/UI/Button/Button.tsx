import { type FC, type ReactNode } from 'react';
import { type ButtonProps as MuiButtonProps } from '@mui/material';
import { type SystemStyleObject } from '@mui/system';

import { Button as MuiButton } from '@mui/material';

// prop types
type propTypes = {
  children: ReactNode;

  type?: MuiButtonProps['type'];
  onClick?: MuiButtonProps['onClick'];

  color?: MuiButtonProps['color'];
  disabled?: MuiButtonProps['disabled'];
  size?: MuiButtonProps['size'];
  sx?: SystemStyleObject;
};

// component
const Button: FC<propTypes> = (props) => {
  const { disabled, children, color, onClick, size, sx, type } = props;

  return (
    <MuiButton
      type={type}
      onClick={onClick}
      disabled={!!disabled}
      variant='contained'
      color={color ? color : 'primary'}
      size={size ? size : 'medium'}
      sx={{
        ml: 2,
        ...sx,
      }}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
