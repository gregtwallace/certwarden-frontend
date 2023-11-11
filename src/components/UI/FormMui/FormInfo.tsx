import { type FC, type ReactNode } from 'react';
import { type TypographyProps } from '@mui/material';

import { Typography } from '@mui/material';

type propTypes = {
  children: ReactNode;
  color?: TypographyProps['color'];
};

const FormInfo: FC<propTypes> = (props) => {
  const { children, color } = props;

  return (
    <Typography color={color} variant='body2' sx={{ mx: 2, my: 3 }}>
      {children}
    </Typography>
  );
};

export default FormInfo;
