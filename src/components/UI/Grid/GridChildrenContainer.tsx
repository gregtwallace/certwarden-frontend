import { type FC, type ReactNode } from 'react';

import { Grid2 } from '@mui/material';

type propTypes = {
  children: ReactNode;
};

const GridChildrenContainer: FC<propTypes> = (props) => {
  const { children } = props;

  return (
    <Grid2
      container
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
      sx={{
        p: 2,
      }}
    >
      {children}
    </Grid2>
  );
};

export default GridChildrenContainer;
