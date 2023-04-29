import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';

const ApiError = (props) => {
  return (
    <Alert sx={{ m: 2 }} severity='error'>
      An API error has occurred.
      <br />
      Response Status Code: {props.code}
      <br />
      Response: {props.message}
    </Alert>
  );
};

ApiError.propTypes = {
  code: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  message: PropTypes.string.isRequired,
};

export default ApiError;
