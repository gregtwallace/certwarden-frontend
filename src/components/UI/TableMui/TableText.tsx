import { type FC, type ReactNode } from 'react';
import { type TypographyProps } from '@mui/material';

import { Typography } from '@mui/material';

type propTypes = {
  children: ReactNode;
  color?: TypographyProps['color'];
};

const TableText: FC<propTypes> = (props) => {
  const { children, color } = props;

  return (
    <Typography variant='body2' color={color} sx={{ m: 3 }} display='block'>
      {children}
    </Typography>
  );
};

export default TableText;
