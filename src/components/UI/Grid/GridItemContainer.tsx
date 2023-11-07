import { type FC, type ReactNode } from 'react';
import { type SxProps } from '@mui/material';

import { Container, Paper } from '@mui/material';

type propTypes = {
  children: ReactNode;
  sx: SxProps;
};

const GridItemContainer: FC<propTypes> = (props) => {
  const { children, sx } = props;

  return (
    <Container component={Paper} sx={{ ...sx, p: 1, height: 1 }}>
      {children}
    </Container>
  );
};

export default GridItemContainer;
