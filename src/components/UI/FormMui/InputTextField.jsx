import PropTypes from 'prop-types';
import { TextField } from '@mui/material';

const InputTextField = (props) => {
  let errorMessage = '';
  switch (props.id) {
    case 'name':
      errorMessage =
        'The name cannot be blank and must only contain these symbols - _ . ~ letters and numbers.';
      break;
    case 'email':
      errorMessage = 'Email address must be in a valid format.';
      break;
    case 'subject':
    case props?.id?.match(/^subject_alts/)?.input:
      errorMessage =
        'Subject name must be a valid (sub)domain name and may start with a wildcard (*.).';
      break;
    case 'new_password':
      errorMessage = 'New password must be at least 10 characters long.';
      break;
    case 'confirm_new_password':
      errorMessage = 'Password confirmation must match new password.';
      break;
    case 'directory_url':
      errorMessage = 'Directory URL must be https.';
      break;
    default:
      errorMessage = 'This field has an error.';
      break;
  }

  let type = 'text';
  if (props.type === 'password') {
    type = 'password';
  }

  return (
    <TextField
      required={props.required && true}
      id={props.id}
      name={props.name ? props.name : props.id}
      type={type}
      label={props.label}
      fullWidth
      variant='outlined'
      value={props.value}
      onChange={props.onChange}
      readOnly={props.readOnly}
      disabled={props.disabled}
      error={props.error}
      helperText={props.error && errorMessage}
      sx={{ my: 1 }}
    />
  );
};

InputTextField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
};

export default InputTextField;
