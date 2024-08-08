import { forwardRef } from 'react';

import { Typography } from '@mui/material';

// prop types
type propTypes = {
  text: string;
  color: string;
  bgcolor: string;
};

// component
const Flag = forwardRef<HTMLSpanElement, propTypes>((props, ref) => {
  const { bgcolor, color, text } = props;

  return (
    <Typography
      // allows Tooltip wrapper
      {...props}
      ref={ref}
      // allows Tooltip wrapper - end
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
});

Flag.displayName = 'Flag';
export default Flag;
