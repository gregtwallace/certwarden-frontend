import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

const FormInfo = (props) => {
  return (
    <Typography variant='subtitle2' fontWeight='regular'>
      {props.children}
    </Typography>
  );
};

FormInfo.propTypes = {
  children: PropTypes.node,
}

export default FormInfo;
