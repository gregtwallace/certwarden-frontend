import PropTypes from 'prop-types';
import { TextField } from '@mui/material';

const InputTextArea = (props) => {
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
      errorMessage = 'Subject must be a valid (sub)domain name.';
      break;
    case 'new_password':
      errorMessage = 'New password must be at least 10 characters long.';
      break;
    case 'confirm_new_password':
      errorMessage = 'Password confirmation must match new password.';
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
      readOnly={props.readOnly && true}
      disabled={props.disabled && true}
      error={props.error}
      helperText={props.error && errorMessage}
      sx={{ my: 1 }}
      multiline
      minRows={5}
      maxRows={10}
      InputProps={{
        style: {
          fontFamily: 'Monospace',
          fontSize: 14,
        },
      }}
    />
  );
};

InputTextArea.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
};

export default InputTextArea;
