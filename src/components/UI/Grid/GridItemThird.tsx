import { type FC, type ReactNode } from 'react';

import { Grid2 } from '@mui/material';

type propTypes = {
  children: ReactNode;
};

const GridItemThird: FC<propTypes> = (props) => {
  const { children } = props;

  return (
    <Grid2
      size={{
        xs: 2,
        sm: 4,
        md: 4,
      }}
    >
      {children}
    </Grid2>
  );
};

export default GridItemThird;
