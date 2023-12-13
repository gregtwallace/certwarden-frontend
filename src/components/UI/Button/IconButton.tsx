import { type FC, type ReactNode } from 'react';
import { type ButtonProps as MuiButtonProps } from '@mui/material';

import { IconButton as MuiIconButton, Tooltip } from '@mui/material';

// prop types
type propTypes = {
  children: ReactNode;

  type?: MuiButtonProps['type'];
  onClick?: MuiButtonProps['onClick'];

  color?: MuiButtonProps['color'];
  tooltip?: string;
};

// component
const IconButton: FC<propTypes> = (props) => {
  const { children, color, type, onClick, tooltip } = props;

  return (
    /* Note: Tooltip doesn't show anything if title is blank */
    <Tooltip title={tooltip}>
      <MuiIconButton
        type={type}
        onClick={onClick}
        color={color ? color : 'inherit'}
      >
        {children}
      </MuiIconButton>
    </Tooltip>
  );
};
export default IconButton;
