import { type FC, type ReactNode } from 'react';

import { Typography } from '@mui/material';

type propTypes = {
  children: ReactNode;
};

const TableText: FC<propTypes> = (props) => {
  const { children } = props;

  return (
    <Typography variant='body2' sx={{ m: 3 }} display='block'>
      {children}
    </Typography>
  );
};

export default TableText;
