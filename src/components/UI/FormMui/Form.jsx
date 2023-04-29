import PropTypes from 'prop-types';
import { Box } from '@mui/material';

const Form = (props) => {
  return (
    <Box
      component='form'
      noValidate
      autoComplete='off'
      onSubmit={props.onSubmit}
    >
      {props.children}
    </Box>
  );
};

Form.propTypes = {
  onSubmit: PropTypes.func,
  children: PropTypes.node,
}

export default Form;
