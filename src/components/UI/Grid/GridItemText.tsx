import { type FC, type ReactNode } from 'react';
import { type SystemStyleObject } from '@mui/system';

import { Typography } from '@mui/material';

type propTypes = {
  children: ReactNode;
  sx?: SystemStyleObject;
};

const GridItemText: FC<propTypes> = (props) => {
  const { children, sx } = props;

  return (
    <Typography variant='body2' display='block' sx={{ my: 1, ...sx }}>
      {children}
    </Typography>
  );
};

export default GridItemText;
