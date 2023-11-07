import { type FC, type ReactNode } from 'react';

import { Container, Paper } from '@mui/material';

// prop types
type propTypes = {
  children: ReactNode;
};

// component
const FormContainer: FC<propTypes> = (props) => {
  const { children } = props;

  return (
    <Container component={Paper} maxWidth='sm' sx={{ mb: 3, p: 1 }}>
      {children}
    </Container>
  );
};

export default FormContainer;
