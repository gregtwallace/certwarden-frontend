import { type FC, type SubmitEventHandler, type ReactNode } from 'react';

import { Box } from '@mui/material';

// prop types
type propTypes = {
  children: ReactNode;
  onSubmit: SubmitEventHandler;
};

// component
const Form: FC<propTypes> = (props) => {
  const { children, onSubmit } = props;

  return (
    <Box onSubmit={onSubmit} component='form' noValidate autoComplete='off'>
      {children}
    </Box>
  );
};

export default Form;
