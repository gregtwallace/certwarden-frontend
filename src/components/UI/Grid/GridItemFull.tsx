import { type FC, type ReactNode } from 'react';

import { Grid } from '@mui/material';

type propTypes = {
  children: ReactNode;
};

const GridItemFull: FC<propTypes> = (props) => {
  const { children } = props;

  return (
    <Grid item columns={12} width={1} display='flex' justifyContent='center'>
      {children}
    </Grid>
  );
};

export default GridItemFull;
