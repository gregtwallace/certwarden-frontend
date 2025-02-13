import { type FC, type ReactNode } from 'react';
import { type SystemStyleObject } from '@mui/system';

import { Container, Paper } from '@mui/material';

type propTypes = {
  children: ReactNode;
  sx?: SystemStyleObject;
};

const GridItemContainer: FC<propTypes> = (props) => {
  const { children, sx } = props;

  return (
    <Container component={Paper} sx={{ p: 1, height: 1, ...sx }}>
      {children}
    </Container>
  );
};

export default GridItemContainer;
