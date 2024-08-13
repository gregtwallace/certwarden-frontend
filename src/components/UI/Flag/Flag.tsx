import { type FC } from 'react';

import { Typography } from '@mui/material';

// prop types
type propTypes = {
  text: string;
  color: string;
  bgcolor: string;
};

// component
const Flag: FC<propTypes> = (props) => {
  const { bgcolor, color, text } = props;

  return (
    <Typography
      component='span'
      variant='caption'
      noWrap
      sx={{
        mx: 0.5,
        paddingX: '10px',
        paddingY: '5px',
        borderRadius: '7px',
        color: color,
        bgcolor: bgcolor,
      }}
    >
      {text}
    </Typography>
  );
};

export default Flag;
