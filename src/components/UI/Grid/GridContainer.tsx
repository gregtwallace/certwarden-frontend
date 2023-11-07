import { type FC, type ReactNode } from 'react';

import { Grid } from '@mui/material';

type propTypes = {
  children: ReactNode;
};

const GridContainer: FC<propTypes> = (props) => {
  const { children } = props;

  return (
    <Grid
      container
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
    >
      {children}
    </Grid>
  );
};

export default GridContainer;
