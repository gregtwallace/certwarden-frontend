import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';

const ApiError = (props) => {
  return (
    <Alert sx={{ m: 2 }} severity='error'>
      An API error has occurred. {props.children}
    </Alert>
  );
};

ApiError.propTypes = {
  children: PropTypes.node
}

export default ApiError;
