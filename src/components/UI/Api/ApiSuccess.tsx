import { type FC, type ReactNode } from 'react';

import Alert from '@mui/material/Alert';

// prop types
type propTypes = {
  children: ReactNode;
};

// component
const ApiSuccess: FC<propTypes> = (props) => {
  const { children } = props;

  return (
    <Alert sx={{ m: 1 }} severity='success'>
      {children}
    </Alert>
  );
};

export default ApiSuccess;
