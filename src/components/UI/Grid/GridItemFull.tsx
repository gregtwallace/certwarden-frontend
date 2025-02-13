import { type FC, type ReactNode } from 'react';

import { Grid2 } from '@mui/material';

type propTypes = {
  children: ReactNode;
};

const GridItemFull: FC<propTypes> = (props) => {
  const { children } = props;

  return (
    <Grid2 columns={12} width={1} display='flex' justifyContent='center'>
      {children}
    </Grid2>
  );
};

export default GridItemFull;
