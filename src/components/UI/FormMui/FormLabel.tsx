import { type FC, type ReactNode } from 'react';

import { Typography } from '@mui/material';

type propTypes = {
  id: string;
  children: ReactNode;
};

const FormLabel: FC<propTypes> = (props) => {
  const { children, id } = props;

  return (
    <Typography id={id} component='label' sx={{ m: 1 }}>
      {children}
    </Typography>
  );
};

export default FormLabel;
