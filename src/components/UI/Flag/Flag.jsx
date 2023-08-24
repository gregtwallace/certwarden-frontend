import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

const Flag = (props) => {
  let color = '';
  let bgcolor = '';
  let text = '';

  switch (props.type) {
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
        case props.days <= 30:
          color = 'white';
          bgcolor = 'error.dark';
          break;
        case props.days <= 40:
          color = 'white';
          bgcolor = 'warning.dark';
          break;
        default:
          color = 'white';
          bgcolor = 'info.dark';
          break;
      }
      text = props.days + ' Days';
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
        padding: '5px',
        borderRadius: '7px',
        color: color,
        bgcolor: bgcolor,
      }}
    >
      {text}
    </Typography>
  );
};

Flag.propTypes = {
  type: PropTypes.string,
  days: PropTypes.number,
}

export default Flag;
