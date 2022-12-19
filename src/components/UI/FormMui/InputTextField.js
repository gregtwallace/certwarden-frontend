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
    />
  );
};

export default InputTextField;
