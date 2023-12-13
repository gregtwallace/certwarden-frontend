import { type FC, type ReactNode } from 'react';

import { Paper } from '@mui/material';

type propTypes = {
  children: ReactNode;
};

const TableContainer: FC<propTypes> = (props) => {
  const { children } = props;

  return (
    <Paper
      sx={{
        display: 'table',
        width: 1,
        mb: 3,
        p: 1,
      }}
    >
      {children}
    </Paper>
  );
};

export default TableContainer;
