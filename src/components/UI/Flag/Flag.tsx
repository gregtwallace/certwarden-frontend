import { type FC } from 'react';

import { Typography } from '@mui/material';

// prop types
type propTypes = {
  type: string;
  days?: number;
};

// component
const Flag: FC<propTypes> = (props) => {
  const { days, type } = props;

  let color = '';
  let bgcolor = '';
  let text = '';

  switch (type) {
    case 'idle':
      color = 'white';
      bgcolor = 'success.dark';
      text = 'Idle';
      break;

    case 'staging':
      color = 'white';
      bgcolor = 'info.dark';
      text = 'Staging';
      break;

    case 'legacy_api':
      color = 'white';
      bgcolor = 'warning.dark';
      text = 'Legacy API';
      break;

    case 'api_key_disabled':
      color = 'white';
      bgcolor = 'secondary.dark';
      text = 'API Disabled';
      break;

    case 'expire-days':
      switch (true) {
        case !!days && days <= 30:
          color = 'white';
          bgcolor = 'error.dark';
          break;
        case !!days && days <= 40:
          color = 'white';
          bgcolor = 'warning.dark';
          break;
        default:
          color = 'white';
          bgcolor = 'info.dark';
          break;
      }
      text = (days || 'err') + ' Days';
      break;

    default:
      color = 'white';
      bgcolor = 'info.dark';
      text = 'Invalid Flag';
      break;
  }

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
