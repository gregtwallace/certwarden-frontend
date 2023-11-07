import { type FC, type ReactNode } from 'react';

import { Box, Toolbar } from '@mui/material';

type propTypes = {
  children: ReactNode;
};

const FormRowRight: FC<propTypes> = (props) => {
  const { children } = props;

  return (
    <Toolbar variant='dense' disableGutters sx={{ mb: 1 }}>
      <Box sx={{ flexGrow: 1 }}></Box>
      {children}
    </Toolbar>
  );
};

export default FormRowRight;
