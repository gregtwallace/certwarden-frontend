import { type FC, type ReactNode } from 'react';
import { type IconButtonProps as MuiIconButtonProps } from '@mui/material';

import { IconButton as MuiIconButton, Tooltip } from '@mui/material';

// prop types
type propTypes = {
  children: ReactNode;

  type?: MuiIconButtonProps['type'];
  onClick?: MuiIconButtonProps['onClick'];

  color?: MuiIconButtonProps['color'];
  edge?: MuiIconButtonProps['edge'];
  tooltip?: string;
};

// component
const IconButton: FC<propTypes> = (props) => {
  const { children, color, edge, type, onClick, tooltip } = props;

  return (
    /* Note: Tooltip doesn't show anything if title is blank */
    <Tooltip title={tooltip} placement='right'>
      <MuiIconButton
        type={type}
        onClick={onClick}
        color={color ? color : 'inherit'}
        edge={edge ? edge : false}
      >
        {children}
      </MuiIconButton>
    </Tooltip>
  );
};
export default IconButton;
