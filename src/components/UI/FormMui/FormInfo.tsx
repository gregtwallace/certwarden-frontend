import { type FC, type ReactNode } from 'react';

import { Typography } from '@mui/material';

type propTypes = {
  children: ReactNode;
};

const FormInfo: FC<propTypes> = (props) => {
  const { children } = props;

  return (
    <Typography variant='body2' sx={{ mx: 2, my: 3 }}>
      {children}
    </Typography>
  );
};

export default FormInfo;
