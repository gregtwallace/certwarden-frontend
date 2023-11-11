import { type FC, type ReactNode } from 'react';
import { type TypographyProps } from '@mui/material';

import { Typography } from '@mui/material';

type propTypes = {
  children: ReactNode;
  color?: TypographyProps['color'];
  wordBreak?: 'normal' | 'break-all' | 'keep-all' | 'break-word';
};

const GridItemText: FC<propTypes> = (props) => {
  const { children, color, wordBreak } = props;

  return (
    <Typography
      variant='body2'
      color={color}
      sx={{ my: 1, wordBreak: wordBreak }}
      display='block'
    >
      {children}
    </Typography>
  );
};

export default GridItemText;
