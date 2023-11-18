import { type FC, type ReactNode } from 'react';
import { type TypographyProps, type SxProps } from '@mui/material';

import { Typography } from '@mui/material';

type propTypes = {
  children: ReactNode;
  color?: TypographyProps['color'];
  sx?: SxProps;
};

const FormInfo: FC<propTypes> = (props) => {
  const { children, color, sx } = props;

  return (
    <Typography color={color} variant='body2' sx={sx || { mx: 2, my: 3 }}>
      {children}
    </Typography>
  );
};

export default FormInfo;
