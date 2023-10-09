import PropTypes from 'prop-types';
import { TextField } from '@mui/material';

const InputTextField = (props) => {
  let errorMessage = '';
  switch (props.id) {
    case 'form.name':
      errorMessage =
        'The name cannot be blank and must only contain these symbols - _ . ~ letters and numbers.';
      break;
    case 'form.email':
      errorMessage = 'Email address must be in a valid format.';
      break;
    case 'form.subject':
    case props?.id?.match(/^form.subject_alts/)?.input:
      errorMessage =
        'Subject name must be a valid (sub)domain name and may start with a wildcard (*.).';
      break;
    case props?.id?.match(/^form.domains/)?.input:
      errorMessage =
        "Domain must be valid. Or for a wildcard provider use one domain set to '*'.";
      break;
    case 'form.new_password':
      errorMessage = 'New password must be at least 10 characters long.';
      break;
    case 'form.confirm_new_password':
      errorMessage = 'Password confirmation must match new password.';
      break;
    case 'form.directory_url':
      errorMessage = 'Directory URL must be https.';
      break;
    case 'form.api_key':
    case 'form.api_key_new':
      errorMessage = 'API keys must be at least 10 characters long.';
      break;
    case 'form.eab_kid':
      errorMessage = 'External Account Binding requires a Key ID.';
      break;
    case 'form.eab_hmac_key':
      errorMessage = 'External Account Binding requires a Key.';
      break;
    case 'form.port':
      errorMessage = 'Port number must be between 1 and 65535.';
      break;
    default:
      errorMessage = 'This field has an error.';
      break;
  }

  return (
    <TextField
      required={props.required && true}
      id={props.id}
      name={props.name ? props.name : props.id}
      type={props.type || 'text'}
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
