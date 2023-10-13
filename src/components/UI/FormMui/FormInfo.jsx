import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

const FormInfo = (props) => {
  const { children, sxColor } = props;

  return (
    <Typography
      variant='body2'
      sx={{ mx: 2, my: 3, color: sxColor || undefined }}
    >
      {children}
    </Typography>
  );
};

FormInfo.propTypes = {
  children: PropTypes.node,
  sxColor: PropTypes.string,
};

export default FormInfo;
