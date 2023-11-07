import { type FC, type FormEventHandler, type ReactNode } from 'react';

import { Box } from '@mui/material';

// prop types
type propTypes = {
  children: ReactNode;
  onSubmit: FormEventHandler;
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
