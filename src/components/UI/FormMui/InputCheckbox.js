import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from '@mui/material';

const InputCheckbox = (props) => {
  let errorMessage = '';
  switch (props.id) {
    case 'accepted_tos':
      errorMessage = 'You must accept the Terms of Service.';
      break;

    default:
      errorMessage = 'This field has an error.';
      break;
  }

  // needed to avoid error about uncontrolled becoming controlled
  const checked = props.checked ? true : false;

  return (
    <FormControl fullWidth sx={{ my: 1 }}>
      <FormControlLabel
        control={
          <Checkbox
            id={props.id}
            name={props.name ? props.name : props.id}
            onChange={props.onChange}
            checked={checked}
            disabled={props.disabled}
          />
        }
        label={props.children}
      />
      {props.error && <FormHelperText error>{errorMessage}</FormHelperText>}
    </FormControl>
  );
};

export default InputCheckbox;
